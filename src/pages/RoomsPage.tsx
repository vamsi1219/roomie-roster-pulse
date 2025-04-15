
import { useState, useEffect } from "react";
import { api, Room, User } from "@/services/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [blockFilter, setBlockFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = api.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          if (currentUser.role === 'student') {
            // Fetch only student's room
            const room = await api.getStudentRoom(currentUser.id);
            if (room) {
              setRooms([room]);
              setFilteredRooms([room]);
            }
          } else {
            // Fetch all rooms for admin/warden
            const roomsData = await api.getRooms();
            setRooms(roomsData);
            setFilteredRooms(roomsData);
          }
        }
      } catch (error) {
        console.error("Error fetching rooms data:", error);
        toast.error("Failed to load rooms data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...rooms];
    
    // Filter by occupancy
    if (filter === "vacant") {
      result = result.filter(room => room.occupants.length === 0);
    } else if (filter === "partially") {
      result = result.filter(room => room.occupants.length > 0 && room.occupants.length < room.capacity);
    } else if (filter === "full") {
      result = result.filter(room => room.occupants.length >= room.capacity);
    }
    
    // Filter by block
    if (blockFilter !== "all") {
      result = result.filter(room => room.block === blockFilter);
    }
    
    setFilteredRooms(result);
  }, [filter, blockFilter, rooms]);

  // Get unique blocks for filter
  const blocks = Array.from(new Set(rooms.map(room => room.block))).sort();

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
          <h1 className="text-3xl font-bold tracking-tight">Room Allocation</h1>
          <p className="text-muted-foreground">
            View and manage hostel room allocations
          </p>
        </div>

        {user?.role !== 'student' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Occupancy:</span>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    <SelectItem value="vacant">Vacant</SelectItem>
                    <SelectItem value="partially">Partially Filled</SelectItem>
                    <SelectItem value="full">Fully Occupied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Block:</span>
                <Select value={blockFilter} onValueChange={setBlockFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    {blocks.map(block => (
                      <SelectItem key={block} value={block}>Block {block}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Button className="bg-hostel-purple hover:bg-hostel-dark-purple">
                Export Room Data
              </Button>
            </div>
          </div>
        )}

        {/* Room Statistics */}
        {user?.role !== 'student' && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="text-2xl font-bold">{rooms.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Vacant Rooms</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="text-2xl font-bold">
                  {rooms.filter(room => room.occupants.length === 0).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Partially Filled</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="text-2xl font-bold">
                  {rooms.filter(room => room.occupants.length > 0 && room.occupants.length < room.capacity).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Fully Occupied</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="text-2xl font-bold">
                  {rooms.filter(room => room.occupants.length >= room.capacity).length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Room Listing */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Room {room.number}</CardTitle>
                    <OccupancyBadge current={room.occupants.length} capacity={room.capacity} />
                  </div>
                  <CardDescription>Block {room.block}, Floor {room.floor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Occupancy Details</h3>
                      <div className="relative h-2 w-full bg-gray-200 rounded">
                        <div 
                          className="absolute top-0 left-0 h-full bg-hostel-purple rounded" 
                          style={{ width: `${(room.occupants.length / room.capacity) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>{room.occupants.length}/{room.capacity} occupied</span>
                        <span>{room.capacity - room.occupants.length} vacant</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Occupants</h3>
                      {room.occupants.length > 0 ? (
                        <div className="space-y-2">
                          {room.occupants.map((student) => (
                            <div key={student.id} className="flex items-center gap-2">
                              {student.profileImage ? (
                                <img
                                  src={student.profileImage}
                                  alt={student.name}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200" />
                              )}
                              <div>
                                <p className="text-sm font-medium">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No occupants</p>
                      )}
                    </div>
                    
                    {user?.role !== 'student' && (
                      <Button variant="outline" className="w-full">
                        Manage Room
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex justify-center p-8">
              <p className="text-muted-foreground">No rooms match the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const OccupancyBadge = ({ current, capacity }: { current: number, capacity: number }) => {
  let badgeText = "";
  let badgeColor = "";
  
  if (current === 0) {
    badgeText = "Vacant";
    badgeColor = "bg-green-500";
  } else if (current < capacity) {
    badgeText = "Partially Filled";
    badgeColor = "bg-blue-500";
  } else {
    badgeText = "Full";
    badgeColor = "bg-red-500";
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={badgeColor}>{badgeText}</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{current} out of {capacity} beds occupied</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RoomsPage;
