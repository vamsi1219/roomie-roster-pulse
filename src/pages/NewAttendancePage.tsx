
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, User } from "@/services/api";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const NewAttendancePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: "outing", // default to outing
    startDate: new Date(),
    endDate: new Date(), // default to same day
    reason: "",
  });

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        navigate("/login");
        return;
      }
      
      if (currentUser.role !== 'student') {
        toast.error("Only students can submit attendance requests");
        navigate("/attendance");
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleTypeChange = (value: string) => {
    // Update type and adjust end date for default durations
    const newData = { ...formData, type: value };
    
    if (value === "home") {
      // Set end date to 3 days later for home visits by default
      const endDate = new Date(formData.startDate);
      endDate.setDate(endDate.getDate() + 3);
      newData.endDate = endDate;
    } else {
      // For outings, default to same day
      const endDate = new Date(formData.startDate);
      endDate.setHours(formData.startDate.getHours() + 8); // 8 hours later
      newData.endDate = endDate;
    }
    
    setFormData(newData);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    let newEndDate = new Date(date);
    
    // Adjust end date based on type
    if (formData.type === "home") {
      newEndDate.setDate(newEndDate.getDate() + 3);
    } else {
      newEndDate.setHours(date.getHours() + 8);
    }
    
    setFormData({
      ...formData,
      startDate: date,
      endDate: newEndDate,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    // Ensure end date is not before start date
    if (date < formData.startDate) {
      toast.error("End date cannot be before start date");
      return;
    }
    
    setFormData({
      ...formData,
      endDate: date,
    });
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      reason: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!formData.reason.trim()) {
      toast.error("Please provide a reason for your request");
      return;
    }
    
    if (formData.startDate > formData.endDate) {
      toast.error("End date cannot be before start date");
      return;
    }
    
    setSubmitting(true);
    
    try {
      await api.createAttendanceRequest({
        studentId: user.id,
        studentName: user.name,
        type: formData.type as 'outing' | 'home',
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        reason: formData.reason,
      });
      
      toast.success("Attendance request submitted successfully");
      navigate("/attendance");
    } catch (error) {
      console.error("Error submitting attendance request:", error);
      toast.error("Failed to submit attendance request");
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/attendance")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Attendance
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit a New Attendance Request</CardTitle>
            <CardDescription>
              Request permission for an outing or home visit. All requests require warden approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Request Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outing">Day Outing</SelectItem>
                    <SelectItem value="home">Home Visit</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.type === "outing" 
                    ? "Day outings are typically for a few hours within the same day." 
                    : "Home visits are typically for multiple days to visit family."
                  }
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date and Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? (
                          format(formData.startDate, "PPP HH:mm")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={handleStartDateChange}
                        initialFocus
                      />
                      <div className="p-3 border-t">
                        <Label htmlFor="startTime">Time</Label>
                        <div className="flex items-center mt-1">
                          <input
                            type="time"
                            id="startTime"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={format(formData.startDate, "HH:mm")}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(formData.startDate);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              handleStartDateChange(newDate);
                            }}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date and Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? (
                          format(formData.endDate, "PPP HH:mm")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={handleEndDateChange}
                        initialFocus
                        disabled={(date) => date < formData.startDate}
                      />
                      <div className="p-3 border-t">
                        <Label htmlFor="endTime">Time</Label>
                        <div className="flex items-center mt-1">
                          <input
                            type="time"
                            id="endTime"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={format(formData.endDate, "HH:mm")}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(formData.endDate);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              handleEndDateChange(newDate);
                            }}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for {formData.type === "outing" ? "Outing" : "Home Visit"}</Label>
                <Textarea
                  id="reason"
                  placeholder={`Please provide a detailed reason for your ${formData.type}...`}
                  value={formData.reason}
                  onChange={handleReasonChange}
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="font-medium mb-2">Important Information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>All requests require warden approval.</li>
                  <li>Approved requests will be notified to your parents via email.</li>
                  <li>For outings, you must return by the approved end time.</li>
                  <li>For home visits, you must sign in when you return to the hostel.</li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/attendance")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-hostel-purple hover:bg-hostel-dark-purple"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAttendancePage;
