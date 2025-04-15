
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Query, User, QueryReply, formatDate } from "@/services/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, MessageSquare, CheckCircle, Clock } from "lucide-react";

const QueryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState<Query | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const currentUser = api.getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          navigate("/login");
          return;
        }
        
        const queryData = await api.getQueryById(id);
        
        if (!queryData) {
          toast.error("Query not found");
          navigate("/queries");
          return;
        }
        
        // Check if student is authorized to view this query
        if (currentUser.role === 'student' && queryData.studentId !== currentUser.id) {
          toast.error("You're not authorized to view this query");
          navigate("/queries");
          return;
        }
        
        setQuery(queryData);
      } catch (error) {
        console.error("Error fetching query details:", error);
        toast.error("Failed to load query details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !query || !replyMessage.trim()) return;
    
    setSubmitting(true);
    
    try {
      const updatedQuery = await api.replyToQuery(query.id, {
        queryId: query.id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        message: replyMessage.trim()
      });
      
      setQuery(updatedQuery);
      setReplyMessage("");
      toast.success("Reply added successfully");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: 'pending' | 'in-progress' | 'resolved') => {
    if (!query) return;
    
    try {
      const updatedQuery = await api.updateQueryStatus(query.id, newStatus);
      setQuery(updatedQuery);
    } catch (error) {
      console.error("Error updating query status:", error);
      toast.error("Failed to update query status");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-hostel-purple"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!query) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Query Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The query you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/queries")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queries
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/queries")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queries
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{query.subject}</CardTitle>
                <CardDescription>
                  Submitted by {query.studentName} on {formatDate(query.createdAt)}
                </CardDescription>
              </div>
              <StatusBadge status={query.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-md">
                <p>{query.description}</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Responses</h3>
                
                {query.replies && query.replies.length > 0 ? (
                  <div className="space-y-4">
                    {query.replies.map((reply) => (
                      <ReplyCard key={reply.id} reply={reply} isCurrentUser={reply.userId === user?.id} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No responses yet</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleReply} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reply">Add Your Response</Label>
                  <Textarea
                    id="reply"
                    placeholder="Type your response here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  {user?.role !== 'student' && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={query.status === 'in-progress' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange('in-progress')}
                        className={query.status === 'in-progress' ? "bg-blue-500 hover:bg-blue-600" : ""}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        In Progress
                      </Button>
                      <Button
                        type="button"
                        variant={query.status === 'resolved' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange('resolved')}
                        className={query.status === 'resolved' ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolved
                      </Button>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="bg-hostel-purple hover:bg-hostel-dark-purple ml-auto"
                    disabled={submitting || !replyMessage.trim()}
                  >
                    {submitting ? "Sending..." : "Send Response"}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let badgeColor = "";
  let badgeText = "";
  
  switch (status) {
    case "pending":
      badgeColor = "bg-orange-500";
      badgeText = "Pending";
      break;
    case "in-progress":
      badgeColor = "bg-blue-500";
      badgeText = "In Progress";
      break;
    case "resolved":
      badgeColor = "bg-green-500";
      badgeText = "Resolved";
      break;
    default:
      badgeColor = "bg-gray-500";
      badgeText = status;
  }
  
  return <Badge className={badgeColor}>{badgeText}</Badge>;
};

const ReplyCard = ({ reply, isCurrentUser }: { reply: QueryReply; isCurrentUser: boolean }) => {
  return (
    <div className={`p-4 rounded-md ${isCurrentUser ? 'bg-hostel-purple/10 border border-hostel-purple/20' : 'bg-muted'}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{reply.userName}</span>
          <Badge variant="outline" className="text-xs capitalize">
            {reply.userRole}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(reply.createdAt)}
        </span>
      </div>
      <p>{reply.message}</p>
    </div>
  );
};

export default QueryDetailPage;
