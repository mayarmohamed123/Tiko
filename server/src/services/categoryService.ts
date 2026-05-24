import prisma from '../config/db.js';
import { slugify } from '../utils/slugify.js';

const notDeleted = { deletedAt: null as null };

export const listCategories = async () => {
  return prisma.category.findMany({
    where: notDeleted,
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true, sortOrder: true },
  });
};

export const createCategory = async (name: string, sortOrder = 0) => {
  const slug = slugify(name);
  return prisma.category.create({
    data: { name, slug, sortOrder },
    select: { id: true, name: true, slug: true, sortOrder: true },
  });
};

export const softDeleteCategory = async (id: string) => {
  const count = await prisma.product.count({
    where: { categoryId: id, ...notDeleted },
  });
  if (count > 0) throw new Error('CATEGORY_HAS_PRODUCTS');

  await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
