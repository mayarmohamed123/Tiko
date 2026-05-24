import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  User as UserIcon
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'products', label: 'Products', icon: Package, path: '/dashboard/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/dashboard/customers' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab }) => {
  const { user } = useAuth();

  return (
    <aside className="w-64 border-r border-tiko-surface-container-high bg-tiko-background hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-outfit font-bold text-tiko-primary">Tiko Admin</h1>
        <p className="text-xs text-tiko-on-surface-variant mt-1">Management Portal</p>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-colors ${
              activeTab === item.id 
                ? 'bg-tiko-primary text-tiko-on-primary' 
                : 'text-tiko-on-surface-variant hover:bg-tiko-surface-container-high'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-tiko-surface-container-high m-4">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 bg-tiko-surface-container-high rounded-full flex items-center justify-center text-tiko-primary">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-tiko-on-surface">{user?.fullName || 'Admin User'}</p>
            <p className="text-xs text-tiko-on-surface-variant">Store Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
