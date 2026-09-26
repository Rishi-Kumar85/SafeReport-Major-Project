import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";

const Analytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({
    total: 0,
    thisMonth: 0,
    resolved: 0,
    avgResolutionTime: "0 days",
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: reports, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (reports) {
        // Category distribution
        const categoryCount = reports.reduce((acc: any, report) => {
          const category = report.category.replace(/_/g, " ");
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const categoryChartData = Object.entries(categoryCount).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));
        setCategoryData(categoryChartData);

        // Status distribution
        const statusCount = reports.reduce((acc: any, report) => {
          const status = report.status.replace(/_/g, " ");
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const statusChartData = Object.entries(statusCount).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));
        setStatusData(statusChartData);

        // Monthly trend (last 6 months)
        const monthlyCount: any = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          monthlyCount[monthKey] = 0;
        }

        reports.forEach((report) => {
          const date = new Date(report.created_at);
          const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          if (monthlyCount[monthKey] !== undefined) {
            monthlyCount[monthKey]++;
          }
        });

        const monthlyChartData = Object.entries(monthlyCount).map(([month, count]) => ({
          month,
          reports: count,
        }));
        setMonthlyData(monthlyChartData);

        // Total stats
        const thisMonth = reports.filter((r) => {
          const reportDate = new Date(r.created_at);
          return (
            reportDate.getMonth() === now.getMonth() &&
            reportDate.getFullYear() === now.getFullYear()
          );
        }).length;

        const resolved = reports.filter((r) => r.status === "resolved" || r.status === "closed").length;

        setTotalStats({
          total: reports.length,
          thisMonth,
          resolved,
          avgResolutionTime: "14 days", // Simplified - would calculate from actual data
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Analytics & Insights
              </span>
            </h1>
            <p className="text-muted-foreground">
              Track corruption reporting trends and statistics
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.thisMonth}</div>
                <p className="text-xs text-muted-foreground mt-1">New reports</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.resolved}</div>
                <p className="text-xs text-muted-foreground mt-1">Completed cases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.avgResolutionTime}</div>
                <p className="text-xs text-muted-foreground mt-1">Average time</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Reports by Category</CardTitle>
                <CardDescription>Distribution of corruption types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Reports by Status</CardTitle>
                <CardDescription>Current status of all reports</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#82ca9d"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Reporting Trend</CardTitle>
              <CardDescription>Number of reports submitted per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reports" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
