import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Clock, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

const Track = () => {
  const { toast } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTrackingId = searchParams.get("id") || "";
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [isSearching, setIsSearching] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // Auto-search if tracking ID is in URL
  useEffect(() => {
    if (initialTrackingId && !reportData) {
      handleSearch({ preventDefault: () => {} } as any);
    }
  }, [initialTrackingId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const { data: report, error: reportError } = await supabase
        .from("reports")
        .select("*")
        .eq("tracking_id", trackingId)
        .single();

      if (reportError) {
        toast({
          title: "Report Not Found",
          description: "No report found with this tracking ID. Please check and try again.",
          variant: "destructive",
        });
        setReportData(null);
        return;
      }

      const { data: timeline, error: timelineError } = await supabase
        .from("report_timeline")
        .select("*")
        .eq("report_id", report.id)
        .order("created_at", { ascending: true });

      if (timelineError) throw timelineError;

      setReportData({
        id: report.tracking_id,
        category: report.category,
        department: report.department,
        location: report.location,
        submittedDate: report.created_at,
        status: report.status,
        lastUpdate: report.updated_at,
        timeline: timeline.map((item) => ({
          status: item.title,
          date: new Date(item.created_at).toLocaleDateString(),
          description: item.description,
          completed: true,
        })),
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Under Investigation":
        return "bg-primary/10 text-primary border-primary/20";
      case "Action Taken":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Closed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Track Your Report
              </span>
            </h1>
            <p className="text-muted-foreground">
              Enter your tracking ID to check the status of your report
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-8 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Enter Tracking ID</CardTitle>
              <CardDescription>
                Use the ID provided when you submitted your report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingId">Tracking ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="trackingId"
                      placeholder="XXXX-XXXX-XXXX"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                      className="font-mono text-lg"
                      required
                    />
                    <Button type="submit" disabled={isSearching || !trackingId}>
                      {isSearching ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Report Status */}
          {reportData && (
            <div className="space-y-6">
              {/* Status Overview */}
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Report Status</CardTitle>
                      <CardDescription className="mt-1">
                        Report ID: <code className="font-mono font-semibold">{reportData.id}</code>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(reportData.status)}>
                      {reportData.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{reportData.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{reportData.department}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{reportData.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">
                        {new Date(reportData.submittedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm mb-1">Last Update</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(reportData.lastUpdate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle>Investigation Timeline</CardTitle>
                  <CardDescription>Track the progress of your report</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reportData.timeline.map((item: any, index: number) => (
                      <div key={index} className="relative flex gap-4">
                        {/* Timeline line */}
                        {index < reportData.timeline.length - 1 && (
                          <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
                        )}

                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.completed
                              ? "bg-secondary/10 border-2 border-secondary"
                              : "bg-muted border-2 border-border"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-secondary" />
                          ) : (
                            <Clock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <div className="flex items-start justify-between mb-1">
                            <h3
                              className={`font-semibold ${
                                item.completed ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {item.status}
                            </h3>
                            <span className="text-sm text-muted-foreground">{item.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Information */}
              <Card className="border-primary/20 bg-accent/50">
                <CardContent className="flex gap-4 items-start p-6">
                  <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="font-semibold text-card-foreground">Anonymous & Secure</p>
                    <p className="text-sm text-muted-foreground">
                      Your identity remains completely anonymous. Only use this tracking ID to monitor progress.
                      Investigation updates are posted in real-time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Track;
