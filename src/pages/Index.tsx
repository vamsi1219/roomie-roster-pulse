
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, Announcement, Attendance, Query, Room, User } from "@/services/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bed, 
  Bell, 
  CalendarClock, 
  MessageSquare, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2 
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = api.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          if (currentUser.role === 'admin' || currentUser.role === 'warden') {
            // Fetch data for admin/warden
            const [roomsData, queriesData, announcementsData, attendancesData] = await Promise.all([
              api.getRooms(),
              api.getQueries(),
              api.getAnnouncements(),
              api.getAttendance()
            ]);
            
            setRooms(roomsData);
            setQueries(queriesData);
            setAnnouncements(announcementsData);
            setAttendances(attendancesData);
          } else {
            // Fetch data for student
            const studentId = currentUser.id;
            const [roomData, studentQueries, studentAnnouncements, studentAttendances] = await Promise.all([
              api.getStudentRoom(studentId),
              api.getStudentQueries(studentId),
              api.getAnnouncements(),
              api.getStudentAttendance(studentId)
            ]);
            
            if (roomData) setRooms([roomData]);
            setQueries(studentQueries);
            setAnnouncements(studentAnnouncements);
            setAttendances(studentAttendances);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the hostel management system
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rooms.length}</div>
              <p className="text-xs text-muted-foreground">
                {rooms.reduce((acc, room) => acc + (room.capacity - room.occupants.length), 0)} vacant spots
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Queries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {queries.filter(q => q.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {queries.filter(q => q.status === 'in-progress').length} in progress
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements.length}</div>
              <p className="text-xs text-muted-foreground">
                {announcements.filter(a => a.important).length} important
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Attendance Requests</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendances.filter(a => a.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {attendances.filter(a => a.status === 'approved').length} approved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Announcements */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Latest updates from hostel management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      {announcement.title}
                      {announcement.important && (
                        <Badge className="bg-red-500">Important</Badge>
                      )}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                </div>
              ))}
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link to="/announcements" className="flex items-center gap-1">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Room Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Room Allocation</CardTitle>
              <CardDescription>Current room status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === 'student' ? (
                rooms.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{rooms[0].number}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Block: </span>
                        {rooms[0].block}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Floor: </span>
                        {rooms[0].floor}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Capacity: </span>
                        {rooms[0].capacity}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Occupants: </span>
                        {rooms[0].occupants.length}
                      </div>
                    </div>
                    <h4 className="font-medium mb-2">Roommates:</h4>
                    <div className="space-y-2">
                      {rooms[0].occupants.map((student) => (
                        <div key={student.id} className="flex items-center gap-2">
                          {student.profileImage ? (
                            <img
                              src={student.profileImage}
                              alt={student.name}
                              className="h-6 w-6 rounded-full"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-muted" />
                          )}
                          <span className="text-sm">{student.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <AlertTriangle className="h-10 w-10 text-orange-500 mb-2" />
                    <p className="text-center text-muted-foreground">
                      No room allocated yet
                    </p>
                  </div>
                )
              ) : (
                <div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span>Total Rooms:</span>
                      <span className="font-medium">{rooms.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fully Occupied:</span>
                      <span className="font-medium">
                        {rooms.filter(room => room.occupants.length >= room.capacity).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Vacant Rooms:</span>
                      <span className="font-medium">
                        {rooms.filter(room => room.occupants.length === 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Vacant Spots:</span>
                      <span className="font-medium">
                        {rooms.reduce((acc, room) => acc + (room.capacity - room.occupants.length), 0)}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/rooms" className="flex items-center justify-center gap-1">
                      View room details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Queries */}
          <Card className="md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Queries</CardTitle>
              <CardDescription>Latest student issues and requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {queries.length > 0 ? (
                queries.slice(0, 3).map((query) => (
                  <div key={query.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        {query.subject}
                        {query.status === 'pending' && (
                          <Badge className="bg-orange-500">Pending</Badge>
                        )}
                        {query.status === 'in-progress' && (
                          <Badge className="bg-blue-500">In Progress</Badge>
                        )}
                        {query.status === 'resolved' && (
                          <Badge className="bg-green-500">Resolved</Badge>
                        )}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{query.description}</p>
                    <p className="text-xs text-muted-foreground">By: {query.studentName}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                  <p className="text-center text-muted-foreground">
                    No queries at the moment
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                {user?.role !== 'student' && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/queries" className="flex items-center gap-1">
                      View all queries
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {user?.role === 'student' && (
                  <Button asChild size="sm" className="bg-hostel-purple hover:bg-hostel-dark-purple">
                    <Link to="/queries/new" className="flex items-center gap-1">
                      Submit new query
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Outing and leave requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {attendances.length > 0 ? (
                attendances.slice(0, 3).map((attendance) => (
                  <div key={attendance.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {attendance.type === 'outing' ? 'Outing' : 'Home Visit'}
                        </span>
                        {attendance.status === 'pending' && (
                          <Badge className="bg-orange-500">Pending</Badge>
                        )}
                        {attendance.status === 'approved' && (
                          <Badge className="bg-green-500">Approved</Badge>
                        )}
                        {attendance.status === 'rejected' && (
                          <Badge className="bg-red-500">Rejected</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(attendance.startDate).toLocaleDateString()} - {new Date(attendance.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                  <p className="text-center text-muted-foreground">
                    No attendance requests
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/attendance" className="flex items-center gap-1">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                {user?.role === 'student' && (
                  <Button asChild size="sm" className="bg-hostel-purple hover:bg-hostel-dark-purple">
                    <Link to="/attendance/new" className="flex items-center gap-1">
                      Request leave
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
