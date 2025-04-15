
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft } from "lucide-react";

const NewQueryPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
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
        toast.error("Only students can submit queries");
        navigate("/queries");
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      await api.createQuery({
        studentId: user.id,
        studentName: user.name,
        subject: formData.subject,
        description: formData.description,
        status: 'pending'
      });
      
      toast.success("Query submitted successfully");
      navigate("/queries");
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("Failed to submit query");
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
            onClick={() => navigate("/queries")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queries
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit a New Query</CardTitle>
            <CardDescription>
              Fill in the details below to submit your query to the hostel management.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="E.g., Water leakage, Furniture issue, Wi-Fi problem"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please provide detailed information about your query..."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[200px]"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/queries")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-hostel-purple hover:bg-hostel-dark-purple"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Query"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewQueryPage;
