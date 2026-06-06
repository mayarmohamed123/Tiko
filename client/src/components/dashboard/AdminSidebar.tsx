import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  User as UserIcon,
  LogOut,
  X
} from 'lucide-react';


interface AdminSidebarProps {
  activeTab: string;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'products', label: 'Products', icon: Package, path: '/dashboard/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/dashboard/customers' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <>
      {/* Backdrop for mobile screen sizes */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-tiko-surface-container-high bg-tiko-background flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Tiko Logo" className="w-8 h-8 object-contain rounded-full border border-tiko-outline-variant bg-white" />
            <div>
              <h1 className="text-lg font-outfit font-bold text-tiko-primary tracking-tight">Tiko Admin</h1>
              <p className="text-[10px] text-tiko-on-surface-variant font-medium">Management Portal</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-tiko-on-surface-variant hover:bg-tiko-surface-container-high md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 mt-6 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose} // Auto close sidebar on mobile tap
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-tiko-primary text-tiko-on-primary shadow-md shadow-tiko-primary/10' 
                  : 'text-tiko-on-surface-variant hover:bg-tiko-surface-container-high'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-tiko-surface-container-high m-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-tiko-surface-container-high bg-tiko-surface-container flex items-center justify-center text-tiko-primary shadow-sm shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Admin avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-tiko-on-surface line-clamp-1">{user?.fullName || 'Admin User'}</p>
                <p className="text-xs text-tiko-on-surface-variant">Store Owner</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-tiko-error hover:bg-red-50 px-4 py-2 rounded-full transition-colors w-full font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
