
import { useState, useEffect } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { api, User } from "@/services/api";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function DashboardLayout({ children, requireAuth = true }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
      setLoading(false);

      if (requireAuth && !currentUser) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, requireAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-hostel-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader user={user} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <AppSidebar isOpen={sidebarOpen} user={user} onClose={closeSidebar} />
        <main className="flex-1 md:ml-[250px] p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
