
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Complaint, Notice, Payment, AppState, ComplaintStatus, Notification, Visitor } from './types';
import { MOCK_ADMIN, MOCK_RESIDENT, INITIAL_COMPLAINTS, INITIAL_NOTICES, INITIAL_PAYMENTS } from './constants';

interface AppContextType extends AppState {
  login: (email: string, role: UserRole, unitNumber?: string, name?: string) => void;
  logout: () => void;
  addComplaint: (complaint: Partial<Complaint>) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => void;
  addNotice: (notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addVisitor: (visitor: Partial<Visitor>) => void;
  updateVisitorExit: (id: string) => void;
  residents: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_VISITORS: Visitor[] = [
  {
    id: 'v1',
    name: 'Michael Scott',
    phone: '555-0199',
    purpose: 'Delivery',
    residentId: 'res-1',
    residentName: 'John Doe',
    unitNumber: 'B-402',
    entryTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'IN'
  },
  {
    id: 'v2',
    name: 'Pam Beesly',
    phone: '555-0122',
    purpose: 'Guest',
    residentId: 'res-2',
    residentName: 'Alice Smith',
    unitNumber: 'A-101',
    entryTime: new Date(Date.now() - 7200000).toISOString(),
    exitTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'OUT'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>(INITIAL_VISITORS);
  const [residents] = useState<User[]>([MOCK_RESIDENT, { ...MOCK_RESIDENT, id: 'res-2', name: 'Alice Smith', unitNumber: 'A-101' }]);

  useEffect(() => {
    if (user) {
      const mockNotifications: Notification[] = [
        {
          id: 'notif-1',
          userId: user.id,
          title: 'Welcome to CivicHub',
          message: `Hello ${user.name}, welcome to your new society management dashboard.`,
          type: 'SYSTEM',
          isRead: false,
          createdAt: new Date().toISOString(),
        }
      ];
      setNotifications(mockNotifications);
    } else {
      setNotifications([]);
    }
  }, [user?.id]);

  const login = (email: string, role: UserRole, unitNumber?: string, name?: string) => {
    if (role === UserRole.ADMIN) {
      setUser({
        ...MOCK_ADMIN,
        email
      });
    } else {
      setUser({
        ...MOCK_RESIDENT,
        id: `res-${Date.now()}`,
        name: name || MOCK_RESIDENT.name,
        email,
        unitNumber: unitNumber || MOCK_RESIDENT.unitNumber
      });
    }
  };

  const logout = () => setUser(null);

  const createNotification = (notif: Partial<Notification>) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      userId: notif.userId || '',
      title: notif.title || 'New Notification',
      message: notif.message || '',
      type: notif.type || 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString(),
      targetTab: notif.targetTab
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addComplaint = (newComplaint: Partial<Complaint>) => {
    const complaint: Complaint = {
      id: `c-${Date.now()}`,
      userId: user?.id || '',
      userName: user?.name || 'Unknown',
      unitNumber: user?.unitNumber || 'N/A',
      title: newComplaint.title || '',
      description: newComplaint.description || '',
      category: newComplaint.category || 'General',
      priority: newComplaint.priority || 'MEDIUM' as any,
      status: ComplaintStatus.OPEN,
      createdAt: new Date().toISOString(),
    };
    setComplaints([complaint, ...complaints]);

    createNotification({
      userId: MOCK_ADMIN.id,
      title: 'New Complaint Raised',
      message: `${user?.name} from ${user?.unitNumber} raised: ${complaint.title}`,
      type: 'COMPLAINT',
      targetTab: 'complaints'
    });
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));

    createNotification({
      userId: complaint.userId,
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.title}" is now ${status.replace('_', ' ')}.`,
      type: 'COMPLAINT',
      targetTab: 'complaints'
    });
  };

  const addNotice = (newNotice: Partial<Notice>) => {
    const notice: Notice = {
      id: `n-${Date.now()}`,
      title: newNotice.title || '',
      content: newNotice.content || '',
      postedBy: user?.name || 'Admin',
      createdAt: new Date().toISOString(),
      category: newNotice.category || 'General',
    };
    setNotices([notice, ...notices]);

    createNotification({
      userId: MOCK_RESIDENT.id,
      title: 'New Society Notice',
      message: notice.title,
      type: 'NOTICE',
      targetTab: 'notices'
    });
  };

  const deleteNotice = (id: string) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addVisitor = (visitorData: Partial<Visitor>) => {
    const visitor: Visitor = {
      id: `v-${Date.now()}`,
      name: visitorData.name || '',
      phone: visitorData.phone || '',
      purpose: visitorData.purpose || '',
      residentId: visitorData.residentId || '',
      residentName: visitorData.residentName || '',
      unitNumber: visitorData.unitNumber || '',
      entryTime: new Date().toISOString(),
      status: 'IN',
    };
    setVisitors([visitor, ...visitors]);

    // Notify the resident about their guest
    createNotification({
      userId: visitor.residentId,
      title: 'Visitor at the Gate',
      message: `${visitor.name} has entered the society to visit you.`,
      type: 'SECURITY',
    });
  };

  const updateVisitorExit = (id: string) => {
    setVisitors(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'OUT', exitTime: new Date().toISOString() } : v
    ));
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      complaints, 
      notices, 
      payments, 
      residents,
      notifications,
      visitors,
      login, 
      logout, 
      addComplaint, 
      updateComplaintStatus, 
      addNotice, 
      deleteNotice,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      addVisitor,
      updateVisitorExit
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
