
import { useState, useEffect } from "react";
import { api, Announcement, User } from "@/services/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Search, Plus, AlertTriangle } from "lucide-react";
import { formatDate } from "@/services/api";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    important: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = api.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const announcementsData = await api.getAnnouncements();
          setAnnouncements(announcementsData);
          setFilteredAnnouncements(announcementsData);
        }
      } catch (error) {
        console.error("Error fetching announcements data:", error);
        toast.error("Failed to load announcements data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...announcements];
    
    // Filter by importance
    if (showImportantOnly) {
      result = result.filter(a => a.important);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredAnnouncements(result);
  }, [showImportantOnly, searchQuery, announcements]);

  const handleCreateAnnouncement = async () => {
    if (!user) return;
    
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const createdAnnouncement = await api.createAnnouncement({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        important: newAnnouncement.important,
        createdBy: user.name,
      });
      
      setAnnouncements([createdAnnouncement, ...announcements]);
      setNewAnnouncement({
        title: "",
        content: "",
        important: false,
      });
      setDialogOpen(false);
      toast.success("Announcement created successfully");
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Failed to create announcement");
    } finally {
      setSubmitting(false);
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
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest hostel announcements
            </p>
          </div>
          {(user?.role === 'admin' || user?.role === 'warden') && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-hostel-purple hover:bg-hostel-dark-purple">
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Create a new announcement for all hostel residents.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter announcement title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter announcement content"
                      className="min-h-[120px]"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="important"
                      checked={newAnnouncement.important}
                      onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, important: checked})}
                    />
                    <Label htmlFor="important">Mark as Important</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateAnnouncement} 
                    className="bg-hostel-purple hover:bg-hostel-dark-purple"
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Create Announcement"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="important-only"
              checked={showImportantOnly}
              onCheckedChange={setShowImportantOnly}
            />
            <Label htmlFor="important-only">Show Important Only</Label>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Announcements Found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery 
                  ? "No announcements match your search criteria." 
                  : showImportantOnly 
                    ? "There are no important announcements at the moment." 
                    : "There are no announcements at the moment."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  return (
    <Card className={announcement.important ? "border-red-200 bg-red-50/30" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {announcement.title}
              {announcement.important && (
                <Badge className="bg-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Important
                </Badge>
              )}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Posted by {announcement.createdBy} on {formatDate(announcement.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{announcement.content}</p>
      </CardContent>
    </Card>
  );
};

export default AnnouncementsPage;
