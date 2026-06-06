import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { StatCard } from '../components/dashboard/StatCard';
import { CustomerFilters } from '../components/dashboard/customers/CustomerFilters';
import { CustomersTable, type Customer } from '../components/dashboard/customers/CustomersTable';
import { CustomerDetailsModal } from '../components/dashboard/customers/CustomerDetailsModal';
import { PageLoader } from '../components/common/PageLoader';
import { customerService } from '../services';
import { mapCustomerDetailToAdmin, mapCustomerToAdmin } from '../utils/adminMappers';
import { getErrorMessage } from '../utils/getErrorMessage';

export const CustomersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusParam =
    statusFilter === 'Active' ? 'active' : statusFilter === 'Inactive' ? 'inactive' : undefined;

  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['admin', 'customers', search, statusParam],
    queryFn: () =>
      customerService.list({
        search: search || undefined,
        status: statusParam,
      }),
    select: (data) => data.map(mapCustomerToAdmin),
  });

  const { data: customerDetailResponse } = useQuery({
    queryKey: ['admin', 'customer', selectedCustomerId],
    queryFn: () => customerService.getById(selectedCustomerId!),
    enabled: Boolean(selectedCustomerId && isModalOpen),
  });

  const customerDetail = customerDetailResponse
    ? mapCustomerDetailToAdmin(customerDetailResponse)
    : null;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }) =>
      customerService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer', selectedCustomerId] });
      toast.success('Customer status updated successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update customer status'));
    },
  });

  const handleOpenDetails = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedCustomerId(null);
    setIsModalOpen(false);
  };

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

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8 font-dm-sans animate-fade-in pb-12">
      {error && (
        <p className="text-sm text-tiko-error">{getErrorMessage(error)}</p>
      )}

      <header className="mb-4">
        <h2 className="text-headline-lg font-outfit text-tiko-on-surface mb-1">Customers Registry</h2>
        <p className="text-tiko-on-surface-variant text-sm">Connected to GET /api/customers</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Customers" value={totalCustomers} subtitle="From API" subtitleColor="text-tiko-on-surface-variant" bgColor="bg-tiko-surface" />
        <StatCard title="Active Accounts" value={activeCustomers} subtitle={`${totalCustomers - activeCustomers} inactive`} subtitleColor="text-tiko-on-surface-variant" bgColor="bg-tiko-surface" />
        <StatCard title="Total Customer Sales" value={`EGP ${totalSpentAll.toFixed(2)}`} subtitle="Aggregated" subtitleColor="text-tiko-on-surface-variant" bgColor="bg-tiko-surface" />
      </div>

      <CustomerFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <CustomersTable customers={filteredCustomers} onViewDetails={handleOpenDetails} />

      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        customer={customerDetail ?? customers.find((c) => c.id === selectedCustomerId) ?? null}
        orderHistory={customerDetailResponse?.orders}
        onStatusChange={(id, status) => updateStatusMutation.mutate({ id, status })}
      />
    </div>
  );
};

export default CustomersPage;
