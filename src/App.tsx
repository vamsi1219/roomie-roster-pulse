
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RoomsPage from "./pages/RoomsPage";
import QueriesPage from "./pages/QueriesPage";
import QueryDetailPage from "./pages/QueryDetailPage";
import NewQueryPage from "./pages/NewQueryPage";
import AttendancePage from "./pages/AttendancePage";
import NewAttendancePage from "./pages/NewAttendancePage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/queries" element={<QueriesPage />} />
          <Route path="/queries/:id" element={<QueryDetailPage />} />
          <Route path="/queries/new" element={<NewQueryPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/attendance/new" element={<NewAttendancePage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
