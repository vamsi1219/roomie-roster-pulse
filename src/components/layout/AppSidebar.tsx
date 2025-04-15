
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Bed,
  Bell,
  CalendarClock,
  FileText,
  Home,
  ListTodo,
  LogIn,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { User as UserType } from "@/services/api";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  user: UserType | null;
  onClose: () => void;
}

export function AppSidebar({
  className,
  isOpen,
  user,
  onClose,
}: SidebarProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      showIf: () => true,
    },
    {
      title: "Room Allocation",
      href: "/rooms",
      icon: <Bed className="h-5 w-5" />,
      showIf: () => true,
    },
    {
      title: "Queries",
      href: "/queries",
      icon: <MessageSquare className="h-5 w-5" />,
      showIf: () => true,
    },
    {
      title: "Attendance",
      href: "/attendance",
      icon: <CalendarClock className="h-5 w-5" />,
      showIf: () => true,
    },
    {
      title: "Announcements",
      href: "/announcements",
      icon: <Bell className="h-5 w-5" />,
      showIf: () => true,
    },
    {
      title: "Students",
      href: "/students",
      icon: <Users className="h-5 w-5" />,
      showIf: () => user?.role === "admin" || user?.role === "warden",
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: <ListTodo className="h-5 w-5" />,
      showIf: () => user?.role === "admin" || user?.role === "warden",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <FileText className="h-5 w-5" />,
      showIf: () => user?.role === "admin" || user?.role === "warden",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      showIf: () => true,
    },
    {
      title: "Login",
      href: "/login",
      icon: <LogIn className="h-5 w-5" />,
      showIf: () => !user,
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full w-[250px] flex-col border-r bg-background transition-transform duration-300 ease-in-out md:relative",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="font-bold text-xl bg-clip-text text-transparent hostel-gradient-bg py-1">RoomieRoster</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 md:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {sidebarItems.filter(item => item.showIf()).map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-hostel-purple",
                isActive(item.href)
                  ? "bg-hostel-purple/10 text-hostel-purple"
                  : "text-muted-foreground"
              )}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      {user && (
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
