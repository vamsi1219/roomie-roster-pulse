
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      await api.login(email, password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requireAuth={false}>
      <div className="mx-auto max-w-md space-y-6 py-12">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login to RoomieRoster</h1>
          <p className="text-gray-500">Enter your credentials to access your account</p>
        </div>
        <div className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="your.email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-hostel-purple hover:bg-hostel-dark-purple"
              disabled={loading}
            >
              {loading ? 
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span> : 
                "Login"
              }
            </Button>
          </form>
          <div className="text-center text-sm">
            <p>Demo Credentials:</p>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <div className="border rounded p-2">
                <p className="font-semibold">Admin</p>
                <p>Email: admin@hostel.com</p>
                <p>Password: password</p>
              </div>
              <div className="border rounded p-2">
                <p className="font-semibold">Warden</p>
                <p>Email: warden@hostel.com</p>
                <p>Password: password</p>
              </div>
              <div className="border rounded p-2">
                <p className="font-semibold">Student</p>
                <p>Email: john@student.com</p>
                <p>Password: password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Login;
