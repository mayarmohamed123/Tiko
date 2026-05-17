import React, { useState } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { CustomerFilters } from '../components/dashboard/customers/CustomerFilters';
import { CustomersTable, type Customer } from '../components/dashboard/customers/CustomersTable';
import { CustomerDetailsModal } from '../components/dashboard/customers/CustomerDetailsModal';

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    name: 'Sarah Tarawneh',
    email: 'sarah.t@example.com',
    phone: '+962 79 123 4567',
    ordersCount: 8,
    totalSpent: 480.00,
    status: 'active',
    joinDate: 'Jan 15, 2026',
    address: 'Apt 4B, Rainbow Street, Amman, Jordan',
    avatarColor: 'bg-orange-100',
  },
  {
    id: 'c-2',
    name: 'Zaid Quraishi',
    email: 'zaid.q@example.com',
    phone: '+962 78 987 6543',
    ordersCount: 3,
    totalSpent: 185.50,
    status: 'active',
    joinDate: 'Feb 10, 2026',
    address: 'Building 12, Mecca Street, Amman, Jordan',
    avatarColor: 'bg-green-100',
  },
  {
    id: 'c-3',
    name: 'Laila Masri',
    email: 'laila.m@example.com',
    phone: '+962 77 456 7890',
    ordersCount: 14,
    totalSpent: 1250.00,
    status: 'active',
    joinDate: 'Nov 02, 2025',
    address: 'Villa 5, Abdoun District, Amman, Jordan',
    avatarColor: 'bg-blue-100',
  },
  {
    id: 'c-4',
    name: 'Omar Haddad',
    email: 'omar.h@example.com',
    phone: '+962 79 000 1111',
    ordersCount: 0,
    totalSpent: 0.00,
    status: 'inactive',
    joinDate: 'Apr 05, 2026',
    address: 'Suite 201, Khalda Area, Amman, Jordan',
    avatarColor: 'bg-yellow-100',
  },
  {
    id: 'c-5',
    name: 'Nour El-Din',
    email: 'nour.ed@example.com',
    phone: '+962 79 555 6666',
    ordersCount: 5,
    totalSpent: 310.00,
    status: 'active',
    joinDate: 'Mar 18, 2026',
    address: 'Floor 3, Weibdeh Hill, Amman, Jordan',
    avatarColor: 'bg-purple-100',
  },
];

export const CustomersPage: React.FC = () => {
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Customer Details Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  // Filter Logic
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(search.toLowerCase()) || 
      cust.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' || 
      (statusFilter === 'Active' && cust.status === 'active') || 
      (statusFilter === 'Inactive' && cust.status === 'inactive');

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  return (
    <div className="space-y-8 font-dm-sans animate-fade-in pb-12">
      {/* Header */}
      <header className="mb-4">
        <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Customers Registry</h2>
        <p className="text-tiko-on-surface-variant text-sm">View, audit, and analyze registered customers profiles and purchase metrics.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Customers"
          value={totalCustomers}
          subtitle="All registered store accounts"
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-tiko-surface"
        />
        <StatCard 
          title="Active Accounts"
          value={activeCustomers}
          subtitle={`${totalCustomers - activeCustomers} inactive account profiles`}
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-tiko-surface"
        />
        <StatCard 
          title="Total Customer Sales"
          value={`$${totalSpentAll.toFixed(2)}`}
          subtitle="Aggregated client checkouts"
          subtitleColor="text-tiko-on-surface-variant"
          bgColor="bg-tiko-surface"
        />
      </div>

      {/* Filters & Search */}
      <CustomerFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Customers Table */}
      <CustomersTable
        customers={filteredCustomers}
        onViewDetails={handleOpenDetails}
      />

      {/* Reusable Customer Detail Insight Modal */}
      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomersPage;
