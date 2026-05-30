import type { AdminCustomer, AdminOrder, AdminProduct } from '../types/admin';
import type { ApiProduct } from '../types/product';
import type { CustomerDetail, CustomerListItem } from '../types/customer';
import type { OrderListItem } from '../types/order';

const AVATAR_COLORS = [
  'bg-orange-100',
  'bg-green-100',
  'bg-blue-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-pink-100',
];

export const avatarColorFor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const mapApiProductToAdmin = (p: ApiProduct): AdminProduct => ({
  id: p.id,
  name: p.name,
  material: p.material,
  category: p.category,
  categoryId: p.categoryId,
  price: p.price,
  stock: p.stockQty,
  // Use null (not '') so <img src={null}> is a no-op instead of re-fetching the page
  image: p.image ?? p.images[0]?.url ?? null,
  availability: p.availability,
  description: p.description,
  colors: p.colors ?? [],
  sizes: p.sizes ?? [],
  images: p.images,
});

export const mapOrderListItemToAdmin = (o: OrderListItem): AdminOrder => ({
  id: o.id,
  orderId: o.orderId,
  customer: o.customer,
  initials: o.initials,
  date: o.date,
  status: o.status,
  statusRaw: o.statusRaw,
  payment: o.payment,
  total: o.total,
});

export const mapCustomerToAdmin = (c: CustomerListItem): AdminCustomer => ({
  id: c.id,
  name: c.name,
  email: c.email,
  phone: c.phone ?? '—',
  ordersCount: c.ordersCount,
  totalSpent: c.totalSpent,
  status: c.status,
  joinDate: c.joinDate,
  address: c.address ?? '—',
  avatarColor: avatarColorFor(c.email),
});

export const mapCustomerDetailToAdmin = (c: CustomerDetail): AdminCustomer => ({
  ...mapCustomerToAdmin(c),
  joinDate:
    typeof c.joinDate === 'string' && c.joinDate.includes('T')
      ? new Date(c.joinDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : String(c.joinDate),
});
