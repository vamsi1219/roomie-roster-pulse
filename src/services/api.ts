import { toast } from "@/components/ui/sonner";

// Mock API service to simulate backend interactions

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'warden' | 'admin';
  profileImage?: string;
}

export interface Room {
  id: string;
  number: string;
  capacity: number;
  occupants: Student[];
  block: string;
  floor: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  roomId?: string;
  profileImage?: string;
  department?: string;
  year?: number;
}

export interface Query {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  replies?: QueryReply[];
}

export interface QueryReply {
  id: string;
  queryId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'warden' | 'admin';
  message: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  important: boolean;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  type: 'outing' | 'home';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// API functions
const API_URL = 'http://localhost:5000/api';

export const api = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const user = await response.json();
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error) {
      throw new Error('Login failed');
    }
  },
  
  logout: async (): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem("currentUser");
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  },
  
  getStudents: async (): Promise<Student[]> => {
    try {
      const response = await fetch(`${API_URL}/users?role=student`);
      return await response.json();
    } catch (error) {
      toast.error('Failed to fetch students');
      return [];
    }
  },
  
  getRooms: async (): Promise<Room[]> => {
    try {
      const response = await fetch(`${API_URL}/rooms`);
      return await response.json();
    } catch (error) {
      toast.error('Failed to fetch rooms');
      return [];
    }
  },
  
  getQueries: async (filter?: string): Promise<Query[]> => {
    try {
      const response = await fetch(`${API_URL}/queries${filter ? `?status=${filter}` : ''}`);
      return await response.json();
    } catch (error) {
      toast.error('Failed to fetch queries');
      return [];
    }
  },
  
  createQuery: async (query: Omit<Query, 'id' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<Query> => {
    try {
      const response = await fetch(`${API_URL}/queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create query');
      }
      
      const newQuery = await response.json();
      toast.success('Query submitted successfully');
      return newQuery;
    } catch (error) {
      toast.error('Failed to create query');
      throw error;
    }
  },
  
  getQueryById: async (id: string): Promise<Query | undefined> => {
    try {
      const response = await fetch(`${API_URL}/queries/${id}`);
      
      if (!response.ok) {
        throw new Error('Query not found');
      }
      
      return await response.json();
    } catch (error) {
      toast.error('Failed to fetch query details');
      return undefined;
    }
  },
  
  replyToQuery: async (queryId: string, reply: Omit<QueryReply, 'id' | 'createdAt'>): Promise<Query> => {
    try {
      const response = await fetch(`${API_URL}/queries/${queryId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reply),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add reply');
      }
      
      const updatedQuery = await response.json();
      toast.success('Reply added successfully');
      return updatedQuery;
    } catch (error) {
      toast.error('Failed to add reply');
      throw error;
    }
  },
  
  updateQueryStatus: async (queryId: string, status: 'pending' | 'in-progress' | 'resolved'): Promise<Query> => {
    try {
      const response = await fetch(`${API_URL}/queries/${queryId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update query status');
      }
      
      const updatedQuery = await response.json();
      toast.success(`Query status updated to ${status}`);
      return updatedQuery;
    } catch (error) {
      toast.error('Failed to update query status');
      throw error;
    }
  },
  
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const response = await fetch(`${API_URL}/announcements`);
      return await response.json();
    } catch (error) {
      toast.error('Failed to fetch announcements');
      return [];
    }
  },
  
  createAnnouncement: async (announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> => {
    try {
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcement),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }
      
      const newAnnouncement = await response.json();
      toast.success('Announcement created successfully');
      return newAnnouncement;
    } catch (error) {
      toast.error('Failed to create announcement');
      throw error;
    }
  },
  
  getAttendance: async (filter?: string): Promise<Attendance[]> => {
    try {
      const response = await fetch(`${API_URL}/attendance${filter ? `?status=${filter}` : ''}`);
      return await response.json();
    } catch (error) {
      toast.error('Failed to fetch attendance records');
      return [];
    }
  },
  
  createAttendanceRequest: async (request: Omit<Attendance, 'id' | 'createdAt' | 'status'>): Promise<Attendance> => {
    try {
      const response = await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create attendance request');
      }
      
      const newRequest = await response.json();
      toast.success('Attendance request submitted successfully');
      return newRequest;
    } catch (error) {
      toast.error('Failed to create attendance request');
      throw error;
    }
  },
  
  updateAttendanceStatus: async (id: string, status: 'approved' | 'rejected'): Promise<Attendance> => {
    try {
      const response = await fetch(`${API_URL}/attendance/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update attendance status');
      }
      
      const updatedRequest = await response.json();
      toast.success(`Attendance request ${status}`);
      return updatedRequest;
    } catch (error) {
      toast.error('Failed to update attendance status');
      throw error;
    }
  },
  
  getStudentRoom: async (studentId: string): Promise<Room | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return null;
  },
  
  getStudentQueries: async (studentId: string): Promise<Query[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [];
  },
  
  getStudentAttendance: async (studentId: string): Promise<Attendance[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [];
  }
};

// Helper function to format dates
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
