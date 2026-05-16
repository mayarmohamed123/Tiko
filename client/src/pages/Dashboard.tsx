import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Tiko Dashboard</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition border border-gray-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gray-700 p-3 rounded-full">
                <UserIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-gray-400 text-sm">Your account details</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Name</p>
                <p className="text-lg">{user?.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Email</p>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">User ID</p>
                <p className="text-xs font-mono text-gray-400 truncate">{user?.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl flex flex-col justify-center items-center text-center">
            <div className="bg-green-900/30 p-4 rounded-full mb-4">
              <Shield className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Protected Content</h2>
            <p className="text-gray-400">
              This page is only accessible to authenticated users. Your session is secured with JWT and HTTP-only cookies.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
