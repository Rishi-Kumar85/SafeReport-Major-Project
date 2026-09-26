import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Report {
  id: string;
  tracking_id: string;
  category: string;
  status: string;
  department: string;
  location: string;
  description: string;
  created_at: string;
  comment_count?: number;
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user_id: string;
}

const PopularReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchPopularReports();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPopularReports = async () => {
    try {
      const { data: reportsData, error } = await supabase
        .from("reports")
        .select(`
          *,
          report_comments(count)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const reportsWithCount = reportsData?.map(report => ({
        ...report,
        comment_count: report.report_comments?.[0]?.count || 0,
      })) || [];

      reportsWithCount.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
      setReports(reportsWithCount);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchComments = async (reportId: string) => {
    try {
      const { data, error } = await supabase
        .from("report_comments")
        .select("*")
        .eq("report_id", reportId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(prev => ({ ...prev, [reportId]: data || [] }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleComments = (reportId: string) => {
    if (selectedReport === reportId) {
      setSelectedReport(null);
    } else {
      setSelectedReport(reportId);
      if (!comments[reportId]) {
        fetchComments(reportId);
      }
    }
  };

  const handleAddComment = async (reportId: string) => {
    if (!user) {
      toast.error("Please login to comment");
      navigate("/auth");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const { error } = await supabase
        .from("report_comments")
        .insert({
          report_id: reportId,
          user_id: user.id,
          comment: newComment.trim(),
        });

      if (error) throw error;

      toast.success("Comment added successfully");
      setNewComment("");
      fetchComments(reportId);
      fetchPopularReports();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
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

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Reports</h2>
          <p className="text-muted-foreground">
            Join the conversation on corruption reports that matter most to the community
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="capitalize">
                      {report.category.replace(/_/g, " ")}
                    </CardTitle>
                    <CardDescription>
                      {report.department} • {report.location}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {report.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComments(report.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {report.comment_count || 0} Comments
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/track?id=${report.tracking_id}`)}
                  >
                    View Details
                  </Button>
                </div>

                {selectedReport === report.id && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div className="space-y-3">
                      {comments[report.id]?.map((comment) => (
                        <div key={comment.id} className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{comment.comment}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {(!comments[report.id] || comments[report.id].length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1"
                        rows={3}
                      />
                      <Button
                        onClick={() => handleAddComment(report.id)}
                        size="sm"
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {reports.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No reports available yet
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularReports;