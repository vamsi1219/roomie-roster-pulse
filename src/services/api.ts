
// Mock API service to simulate backend interactions
import { toast } from "@/components/ui/sonner";

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

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@hostel.com",
    role: "admin",
    profileImage: "https://ui-avatars.com/api/?name=Admin+User&background=9b87f5&color=fff"
  },
  {
    id: "2",
    name: "Warden Smith",
    email: "warden@hostel.com",
    role: "warden",
    profileImage: "https://ui-avatars.com/api/?name=Warden+Smith&background=7E69AB&color=fff"
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@student.com",
    role: "student",
    profileImage: "https://ui-avatars.com/api/?name=John+Doe&background=D6BCFA&color=fff"
  }
];

const mockStudents: Student[] = [
  {
    id: "3",
    name: "John Doe",
    rollNumber: "S12345",
    email: "john@student.com",
    phone: "1234567890",
    roomId: "1",
    profileImage: "https://ui-avatars.com/api/?name=John+Doe&background=D6BCFA&color=fff",
    department: "Computer Science",
    year: 2
  },
  {
    id: "4",
    name: "Jane Smith",
    rollNumber: "S12346",
    email: "jane@student.com",
    phone: "9876543210",
    roomId: "1",
    profileImage: "https://ui-avatars.com/api/?name=Jane+Smith&background=D6BCFA&color=fff",
    department: "Electrical Engineering",
    year: 3
  },
  {
    id: "5",
    name: "Mike Johnson",
    rollNumber: "S12347",
    email: "mike@student.com",
    phone: "5555555555",
    roomId: "2",
    profileImage: "https://ui-avatars.com/api/?name=Mike+Johnson&background=D6BCFA&color=fff",
    department: "Mechanical Engineering",
    year: 1
  },
  {
    id: "6",
    name: "Sarah Williams",
    rollNumber: "S12348",
    email: "sarah@student.com",
    phone: "7777777777",
    roomId: "2",
    profileImage: "https://ui-avatars.com/api/?name=Sarah+Williams&background=D6BCFA&color=fff",
    department: "Civil Engineering",
    year: 4
  }
];

const mockRooms: Room[] = [
  {
    id: "1",
    number: "A-101",
    capacity: 3,
    occupants: mockStudents.filter(s => s.roomId === "1"),
    block: "A",
    floor: 1
  },
  {
    id: "2",
    number: "A-102",
    capacity: 2,
    occupants: mockStudents.filter(s => s.roomId === "2"),
    block: "A",
    floor: 1
  },
  {
    id: "3",
    number: "B-201",
    capacity: 3,
    occupants: [],
    block: "B",
    floor: 2
  },
  {
    id: "4",
    number: "B-202",
    capacity: 2,
    occupants: [],
    block: "B",
    floor: 2
  }
];

const mockQueries: Query[] = [
  {
    id: "1",
    studentId: "3",
    studentName: "John Doe",
    subject: "Water leakage in room",
    description: "There's water leaking from the ceiling in our room A-101. Please fix it as soon as possible.",
    status: "pending",
    createdAt: "2023-10-15T12:30:00Z",
    updatedAt: "2023-10-15T12:30:00Z",
    replies: []
  },
  {
    id: "2",
    studentId: "4",
    studentName: "Jane Smith",
    subject: "Wi-Fi issues",
    description: "The Wi-Fi connection is very weak in our room. Can you please check?",
    status: "in-progress",
    createdAt: "2023-10-14T10:15:00Z",
    updatedAt: "2023-10-15T14:20:00Z",
    replies: [
      {
        id: "1",
        queryId: "2",
        userId: "2",
        userName: "Warden Smith",
        userRole: "warden",
        message: "We'll check the Wi-Fi router near your block. Someone will visit tomorrow.",
        createdAt: "2023-10-15T14:20:00Z"
      }
    ]
  },
  {
    id: "3",
    studentId: "5",
    studentName: "Mike Johnson",
    subject: "Locker not working",
    description: "The locker in my room doesn't lock properly. I need it fixed for security reasons.",
    status: "resolved",
    createdAt: "2023-10-12T09:45:00Z",
    updatedAt: "2023-10-14T11:30:00Z",
    replies: [
      {
        id: "2",
        queryId: "3",
        userId: "2",
        userName: "Warden Smith",
        userRole: "warden",
        message: "We'll send someone to check your locker tomorrow.",
        createdAt: "2023-10-13T10:30:00Z"
      },
      {
        id: "3",
        queryId: "3",
        userId: "2",
        userName: "Warden Smith",
        userRole: "warden",
        message: "The locker has been fixed. Please let us know if you face any further issues.",
        createdAt: "2023-10-14T11:30:00Z"
      }
    ]
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Hostel Maintenance Schedule",
    content: "The hostel will undergo maintenance on October 20, 2023. Please ensure your rooms are accessible between 10 AM and 4 PM.",
    createdBy: "Warden Smith",
    createdAt: "2023-10-15T08:00:00Z",
    important: true
  },
  {
    id: "2",
    title: "New Mess Menu",
    content: "A new mess menu will be implemented from next week. You can check the details on the notice board.",
    createdBy: "Admin User",
    createdAt: "2023-10-14T14:30:00Z",
    important: false
  },
  {
    id: "3",
    title: "Weekend Outing Policy Update",
    content: "Due to recent events, weekend outing policies have been updated. Please read the detailed guidelines on the hostel website.",
    createdBy: "Warden Smith",
    createdAt: "2023-10-13T16:45:00Z",
    important: true
  }
];

const mockAttendance: Attendance[] = [
  {
    id: "1",
    studentId: "3",
    studentName: "John Doe",
    type: "outing",
    startDate: "2023-10-16T09:00:00Z",
    endDate: "2023-10-16T18:00:00Z",
    reason: "Personal work in the city",
    status: "approved",
    createdAt: "2023-10-15T10:30:00Z"
  },
  {
    id: "2",
    studentId: "4",
    studentName: "Jane Smith",
    type: "home",
    startDate: "2023-10-18T08:00:00Z",
    endDate: "2023-10-22T20:00:00Z",
    reason: "Family function",
    status: "pending",
    createdAt: "2023-10-15T12:15:00Z"
  },
  {
    id: "3",
    studentId: "5",
    studentName: "Mike Johnson",
    type: "outing",
    startDate: "2023-10-17T14:00:00Z",
    endDate: "2023-10-17T20:00:00Z",
    reason: "Doctor's appointment",
    status: "approved",
    createdAt: "2023-10-14T09:20:00Z"
  }
];

// API functions
export const api = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || password !== "password") {
      throw new Error("Invalid credentials");
    }
    
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockStudents];
  },
  
  getRooms: async (): Promise<Room[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockRooms.map(room => {
      // Ensure we return the latest occupant information
      return {
        ...room,
        occupants: mockStudents.filter(s => s.roomId === room.id)
      };
    });
  },
  
  getQueries: async (filter?: string): Promise<Query[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let queries = [...mockQueries];
    
    if (filter) {
      if (filter === 'pending') queries = queries.filter(q => q.status === 'pending');
      if (filter === 'in-progress') queries = queries.filter(q => q.status === 'in-progress');
      if (filter === 'resolved') queries = queries.filter(q => q.status === 'resolved');
    }
    
    return queries;
  },
  
  getQueryById: async (id: string): Promise<Query | undefined> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockQueries.find(q => q.id === id);
  },
  
  createQuery: async (query: Omit<Query, 'id' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<Query> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newQuery: Query = {
      id: `${mockQueries.length + 1}`,
      ...query,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: []
    };
    
    mockQueries.push(newQuery);
    toast.success("Query submitted successfully");
    return newQuery;
  },
  
  replyToQuery: async (queryId: string, reply: Omit<QueryReply, 'id' | 'createdAt'>): Promise<Query> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const queryIndex = mockQueries.findIndex(q => q.id === queryId);
    
    if (queryIndex === -1) {
      throw new Error("Query not found");
    }
    
    const newReply: QueryReply = {
      id: `${mockQueries[queryIndex].replies?.length || 0 + 1}`,
      ...reply,
      createdAt: new Date().toISOString()
    };
    
    if (!mockQueries[queryIndex].replies) {
      mockQueries[queryIndex].replies = [];
    }
    
    mockQueries[queryIndex].replies!.push(newReply);
    mockQueries[queryIndex].updatedAt = new Date().toISOString();
    mockQueries[queryIndex].status = 'in-progress';
    
    toast.success("Reply added successfully");
    return mockQueries[queryIndex];
  },
  
  updateQueryStatus: async (queryId: string, status: 'pending' | 'in-progress' | 'resolved'): Promise<Query> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const queryIndex = mockQueries.findIndex(q => q.id === queryId);
    
    if (queryIndex === -1) {
      throw new Error("Query not found");
    }
    
    mockQueries[queryIndex].status = status;
    mockQueries[queryIndex].updatedAt = new Date().toISOString();
    
    toast.success(`Query marked as ${status}`);
    return mockQueries[queryIndex];
  },
  
  getAnnouncements: async (): Promise<Announcement[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    return [...mockAnnouncements];
  },
  
  createAnnouncement: async (announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 900));
    
    const newAnnouncement: Announcement = {
      id: `${mockAnnouncements.length + 1}`,
      ...announcement,
      createdAt: new Date().toISOString()
    };
    
    mockAnnouncements.push(newAnnouncement);
    toast.success("Announcement created successfully");
    return newAnnouncement;
  },
  
  getAttendance: async (filter?: string): Promise<Attendance[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    let attendance = [...mockAttendance];
    
    if (filter) {
      if (filter === 'pending') attendance = attendance.filter(a => a.status === 'pending');
      if (filter === 'approved') attendance = attendance.filter(a => a.status === 'approved');
      if (filter === 'rejected') attendance = attendance.filter(a => a.status === 'rejected');
    }
    
    return attendance;
  },
  
  createAttendanceRequest: async (request: Omit<Attendance, 'id' | 'createdAt' | 'status'>): Promise<Attendance> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 900));
    
    const newRequest: Attendance = {
      id: `${mockAttendance.length + 1}`,
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    mockAttendance.push(newRequest);
    toast.success("Attendance request submitted successfully");
    return newRequest;
  },
  
  updateAttendanceStatus: async (id: string, status: 'approved' | 'rejected'): Promise<Attendance> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const attendanceIndex = mockAttendance.findIndex(a => a.id === id);
    
    if (attendanceIndex === -1) {
      throw new Error("Attendance request not found");
    }
    
    mockAttendance[attendanceIndex].status = status;
    
    // Simulate sending email
    if (status === 'approved') {
      console.log(`Email sent to ${mockAttendance[attendanceIndex].studentName}'s parent for ${mockAttendance[attendanceIndex].type} request`);
      toast.success(`Email notification sent to parent`);
    }
    
    toast.success(`Attendance request ${status}`);
    return mockAttendance[attendanceIndex];
  },
  
  // Student specific APIs
  getStudentRoom: async (studentId: string): Promise<Room | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const student = mockStudents.find(s => s.id === studentId);
    
    if (!student || !student.roomId) {
      return null;
    }
    
    const room = mockRooms.find(r => r.id === student.roomId);
    
    if (!room) {
      return null;
    }
    
    // Ensure we return the latest occupant information
    return {
      ...room,
      occupants: mockStudents.filter(s => s.roomId === room.id)
    };
  },
  
  getStudentQueries: async (studentId: string): Promise<Query[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return mockQueries.filter(q => q.studentId === studentId);
  },
  
  getStudentAttendance: async (studentId: string): Promise<Attendance[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return mockAttendance.filter(a => a.studentId === studentId);
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
