import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Calendar, 
  Bell, 
  LogOut 
} from "lucide-react";
import { User as ApiUser } from "@/services/api";

export function AppSidebar({ 
  isOpen, 
  user, 
  onClose 
}: { 
  isOpen: boolean; 
  user: ApiUser | null; 
  onClose: () => void;
}) {
  const sidebarClass = isOpen
    ? "w-[250px] bg-gray-50 border-r border-gray-200 px-4 py-6 flex flex-col transition-transform transform-none"
    : "-translate-x-full w-[250px] bg-gray-50 border-r border-gray-200 px-4 py-6 flex flex-col transition-transform md:transform-none md:translate-x-0";

  return (
    <aside
      className={`${sidebarClass} fixed top-0 left-0 h-full md:relative`}
    >
      <div className="mb-8">
        <Link to="/" className="flex items-center text-lg font-semibold">
          <Home className="mr-2 h-5 w-5" />
          RoomieRoster
        </Link>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/rooms" className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100">
              <Users className="mr-2 h-4 w-4" />
              Rooms
            </Link>
          </li>
          <li>
            <Link to="/queries" className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100">
              <MessageSquare className="mr-2 h-4 w-4" />
              Queries
            </Link>
          </li>
          <li>
            <Link to="/attendance" className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100">
              <Calendar className="mr-2 h-4 w-4" />
              Attendance
            </Link>
          </li>
          <li>
            <Link to="/announcements" className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100">
              <Bell className="mr-2 h-4 w-4" />
              Announcements
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        {user && (
          <div className="py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Logged in as:</p>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}
        <Link to="/login" className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Link>
      </div>

      {!isOpen && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </aside>
  );
}
