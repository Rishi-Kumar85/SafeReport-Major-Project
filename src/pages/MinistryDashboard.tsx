import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Report {
  id: string;
  tracking_id: string;
  category: string;
  department: string;
  location: string;
  status: string;
  description: string;
  created_at: string;
  incident_date: string;
}

const MinistryDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMinistryRole, setHasMinistryRole] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkMinistryRole();
  }, []);

  const checkMinistryRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["ministry", "admin"]);

      if (error) throw error;

      if (!roles || roles.length === 0) {
        toast({
          title: "Access Denied",
          description: "You need ministry or admin access to view this page.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setHasMinistryRole(true);
      fetchReports();
    } catch (error: any) {
      console.error("Error checking role:", error);
      toast({
        title: "Error",
        description: "Failed to verify access permissions.",
        variant: "destructive",
      });
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load reports.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: "submitted" | "investigating" | "resolved") => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: newStatus })
        .eq("id", reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report status updated successfully.",
      });

      fetchReports();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update report status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500";
      case "investigating":
        return "bg-yellow-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const filterByStatus = (status: string) => {
    return reports.filter((report) => report.status === status);
  };

  const submittedReports = filterByStatus("submitted");
  const investigatingReports = filterByStatus("investigating");
  const resolvedReports = filterByStatus("resolved");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasMinistryRole) {
    return null;
  }

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{report.category}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {report.tracking_id}
            </p>
          </div>
          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Department:</span> {report.department}
          </p>
          <p>
            <span className="font-medium">Location:</span> {report.location}
          </p>
          <p>
            <span className="font-medium">Date:</span>{" "}
            {new Date(report.incident_date).toLocaleDateString()}
          </p>
          <p className="text-muted-foreground line-clamp-2">
            {report.description}
          </p>
          <div className="flex gap-2 mt-4">
            <Select
              onValueChange={(value) => updateReportStatus(report.id, value as "submitted" | "investigating" | "resolved")}
              defaultValue={report.status}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submitted">Pending</SelectItem>
                <SelectItem value="investigating">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => navigate(`/track?id=${report.tracking_id}`)}
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Ministry Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{submittedReports.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{investigatingReports.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{resolvedReports.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submitted" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submitted">
              Pending ({submittedReports.length})
            </TabsTrigger>
            <TabsTrigger value="investigating">
              In Review ({investigatingReports.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedReports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submitted" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submittedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
              {submittedReports.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No pending reports
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="investigating" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investigatingReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
              {investigatingReports.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No reports in review
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolvedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
              {resolvedReports.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No resolved reports
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default MinistryDashboard;
