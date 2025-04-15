
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, Query, User } from "@/services/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatDate } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { MessageSquare, Plus } from "lucide-react";

const QueriesPage = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = api.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          let queriesData: Query[] = [];
          
          if (currentUser.role === 'student') {
            // Fetch only student's queries
            queriesData = await api.getStudentQueries(currentUser.id);
          } else {
            // Fetch all queries for admin/warden
            queriesData = await api.getQueries();
          }
          
          setQueries(queriesData);
          setFilteredQueries(queriesData);
        }
      } catch (error) {
        console.error("Error fetching queries data:", error);
        toast.error("Failed to load queries data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply status filter
    if (statusFilter === "all") {
      setFilteredQueries(queries);
    } else {
      setFilteredQueries(queries.filter(query => query.status === statusFilter));
    }
  }, [statusFilter, queries]);

  const handleStatusChange = async (queryId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    try {
      const updatedQuery = await api.updateQueryStatus(queryId, newStatus);
      setQueries(prevQueries => 
        prevQueries.map(q => q.id === queryId ? updatedQuery : q)
      );
      
      // Re-apply filters
      if (statusFilter === "all" || statusFilter === newStatus) {
        setFilteredQueries(prevFiltered => 
          prevFiltered.map(q => q.id === queryId ? updatedQuery : q)
        );
      } else {
        setFilteredQueries(prevFiltered => 
          prevFiltered.filter(q => q.id !== queryId)
        );
      }
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Queries</h1>
            <p className="text-muted-foreground">
              {user?.role === 'student' 
                ? "Submit and track your queries" 
                : "Manage and respond to student queries"}
            </p>
          </div>
          {user?.role === 'student' && (
            <Button asChild className="bg-hostel-purple hover:bg-hostel-dark-purple">
              <Link to="/queries/new">
                <Plus className="h-4 w-4 mr-2" />
                New Query
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Queries</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {user?.role !== 'student' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                <span className="text-sm">Pending: {queries.filter(q => q.status === 'pending').length}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                <span className="text-sm">In Progress: {queries.filter(q => q.status === 'in-progress').length}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-sm">Resolved: {queries.filter(q => q.status === 'resolved').length}</span>
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filteredQueries.length > 0 ? (
            filteredQueries.map((query) => (
              <Card key={query.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{query.subject}</CardTitle>
                      <CardDescription>
                        Submitted by {query.studentName} on {formatDate(query.createdAt)}
                      </CardDescription>
                    </div>
                    <StatusBadge status={query.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{query.description}</p>
                  
                  {query.replies && query.replies.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <h4 className="text-sm font-medium mb-2">Latest Response:</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{query.replies[query.replies.length - 1].userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(query.replies[query.replies.length - 1].createdAt)}
                          </span>
                        </div>
                        <p>{query.replies[query.replies.length - 1].message}</p>
                      </div>
                      {query.replies.length > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          +{query.replies.length - 1} more {query.replies.length - 1 === 1 ? 'reply' : 'replies'}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end items-center gap-2 mt-4">
                    <Button asChild variant="outline">
                      <Link to={`/queries/${query.id}`} className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {query.replies && query.replies.length > 0 ? "Continue Discussion" : "Reply"}
                      </Link>
                    </Button>
                    
                    {user?.role !== 'student' && (
                      <Select 
                        defaultValue={query.status}
                        onValueChange={(value) => handleStatusChange(
                          query.id, 
                          value as 'pending' | 'in-progress' | 'resolved'
                        )}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Mark Pending</SelectItem>
                          <SelectItem value="in-progress">Mark In Progress</SelectItem>
                          <SelectItem value="resolved">Mark Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Queries Found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {statusFilter !== "all" 
                  ? `There are no queries with status "${statusFilter}".` 
                  : user?.role === 'student' 
                    ? "You haven't submitted any queries yet." 
                    : "There are no student queries at the moment."
                }
              </p>
              {user?.role === 'student' && (
                <Button asChild className="bg-hostel-purple hover:bg-hostel-dark-purple">
                  <Link to="/queries/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit a New Query
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
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

export default QueriesPage;
