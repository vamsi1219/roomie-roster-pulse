
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, Attendance, User } from "@/services/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import { CalendarClock, Check, Plus, X } from "lucide-react";
import { formatDate } from "@/services/api";

const AttendancePage = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = api.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          let attendanceData: Attendance[] = [];
          
          if (currentUser.role === 'student') {
            // Fetch only student's attendance records
            attendanceData = await api.getStudentAttendance(currentUser.id);
          } else {
            // Fetch all attendance records for admin/warden
            attendanceData = await api.getAttendance();
          }
          
          setAttendances(attendanceData);
          setFilteredAttendances(attendanceData);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        toast.error("Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...attendances];
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(a => a.status === statusFilter);
    }
    
    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter(a => a.type === typeFilter);
    }
    
    setFilteredAttendances(result);
  }, [statusFilter, typeFilter, attendances]);

  const handleStatusChange = async (attendanceId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const updatedAttendance = await api.updateAttendanceStatus(attendanceId, newStatus);
      
      setAttendances(prev => 
        prev.map(a => a.id === attendanceId ? updatedAttendance : a)
      );
      
      // Re-apply filters to update the filtered list
      if (statusFilter === "all" || statusFilter === newStatus) {
        setFilteredAttendances(prev => 
          prev.map(a => a.id === attendanceId ? updatedAttendance : a)
        );
      } else {
        setFilteredAttendances(prev => 
          prev.filter(a => a.id !== attendanceId)
        );
      }
      
      toast.success(`Attendance request ${newStatus}`);
    } catch (error) {
      console.error("Error updating attendance status:", error);
      toast.error("Failed to update attendance status");
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
            <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
            <p className="text-muted-foreground">
              {user?.role === 'student' 
                ? "Request and track your outings and home visits" 
                : "Manage student attendance and leave requests"
              }
            </p>
          </div>
          {user?.role === 'student' && (
            <Button asChild className="bg-hostel-purple hover:bg-hostel-dark-purple">
              <Link to="/attendance/new">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Type:</span>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="outing">Outing</SelectItem>
                  <SelectItem value="home">Home Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {user?.role !== 'student' && (
            <Button variant="outline">
              Export Attendance Data
            </Button>
          )}
        </div>

        {/* Attendance Summary for Wardens/Admins */}
        {user?.role !== 'student' && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendances.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendances.filter(a => a.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Students Out</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendances.filter(a => 
                    a.status === 'approved' && 
                    new Date(a.startDate) <= new Date() && 
                    new Date(a.endDate) >= new Date()
                  ).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Returning Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendances.filter(a => {
                    const endDate = new Date(a.endDate);
                    const today = new Date();
                    return a.status === 'approved' && 
                      endDate.getDate() === today.getDate() &&
                      endDate.getMonth() === today.getMonth() &&
                      endDate.getFullYear() === today.getFullYear();
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          {filteredAttendances.length > 0 ? (
            filteredAttendances.map((attendance) => (
              <Card key={attendance.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg flex items-center flex-wrap gap-2">
                        <span className="capitalize">{attendance.type}</span>
                        <Badge className={
                          attendance.status === 'pending' ? 'bg-orange-500' :
                          attendance.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        }>
                          {attendance.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {user?.role !== 'student' ? `Student: ${attendance.studentName}` : ''}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-col sm:items-end">
                      <span>From: {formatDate(attendance.startDate)}</span>
                      <span>To: {formatDate(attendance.endDate)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Reason:</h3>
                      <p className="text-sm">{attendance.reason}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Requested on {formatDate(attendance.createdAt)}
                      </div>
                      
                      {user?.role !== 'student' && attendance.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => handleStatusChange(attendance.id, 'approved')}
                            className="bg-green-500 hover:bg-green-600"
                            size="sm"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleStatusChange(attendance.id, 'rejected')}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <CalendarClock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Attendance Requests Found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {statusFilter !== "all" || typeFilter !== "all"
                  ? "No requests match your current filters."
                  : user?.role === 'student' 
                    ? "You haven't submitted any attendance requests yet." 
                    : "There are no student attendance requests at the moment."
                }
              </p>
              {user?.role === 'student' && (
                <Button asChild className="bg-hostel-purple hover:bg-hostel-dark-purple">
                  <Link to="/attendance/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit a New Request
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

export default AttendancePage;
