export const generateOrderNumber = async (
  getCount: () => Promise<number>
): Promise<string> => {
  const count = await getCount();
  const seq = String(count + 1).padStart(4, '0');
  const year = new Date().getFullYear().toString().slice(-2);
  return `TK-${year}${seq}`;
};
