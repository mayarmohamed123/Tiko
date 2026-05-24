export type Availability = 'available' | 'limited' | 'sold-out';

export const getAvailability = (
  stockQty: number,
  lowStockThreshold: number
): Availability => {
  if (stockQty <= 0) return 'sold-out';
  if (stockQty < lowStockThreshold) return 'limited';
  return 'available';
};
