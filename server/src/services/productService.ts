import prisma from '../config/db.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';
import { getAvailability } from '../utils/productAvailability.js';
import {
  uploadProductImage,
  deleteCloudinaryImage,
} from '../utils/cloudinary.js';
import type { CreateProductInput, UpdateProductInput } from '../schemas/productSchema.js';

const notDeleted = { deletedAt: null as null };

const formatProduct = (product: {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  material: string;
  description: string;
  price: number;
  stockQty: number;
  lowStockThreshold: number;
  categoryId: string;
  status: string;
  colors: string[];
  sizes: string[];
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string };
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    sortOrder: number;
    isPrimary: boolean;
  }>;
}) => {
  const activeImages = product.images.filter(() => true);
  const primary = activeImages.find((i) => i.isPrimary) ?? activeImages[0];
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    material: product.material,
    description: product.description,
    price: product.price / 100,
    priceMinor: product.price,
    stock: product.stockQty,
    stockQty: product.stockQty,
    lowStockThreshold: product.lowStockThreshold,
    category: product.category.name,
    categoryId: product.categoryId,
    status: product.status,
    colors: product.colors,
    sizes: product.sizes,
    availability: getAvailability(product.stockQty, product.lowStockThreshold),
    image: primary?.url ?? null,
    images: activeImages.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

const productInclude = {
  category: true,
  images: {
    where: notDeleted,
    orderBy: { sortOrder: 'asc' as const },
  },
};

export const listProducts = async (params: {
  categoryId?: string;
  search?: string;
  includeArchived?: boolean;
  admin?: boolean;
}) => {
  const where: Record<string, unknown> = { ...notDeleted };
  if (!params.admin) {
    where.status = 'ACTIVE';
  }
  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { material: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });

  return products.map(formatProduct);
};

export const getProductBySlug = async (slug: string) => {
  let product = await prisma.product.findFirst({
    where: { slug, ...notDeleted, status: 'ACTIVE' },
    include: productInclude,
  });

  // Fallback: If not found and the parameter is a valid UUID, try fetching by ID
  if (!product && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug)) {
    product = await prisma.product.findFirst({
      where: { id: slug, ...notDeleted, status: 'ACTIVE' },
      include: productInclude,
    });
  }

  if (!product) throw new Error('PRODUCT_NOT_FOUND');
  return formatProduct(product);
};

export const getProductById = async (id: string, admin = false) => {
  const where: Record<string, unknown> = { id, ...notDeleted };
  if (!admin) {
    where.status = 'ACTIVE';
  }
  const product = await prisma.product.findFirst({
    where,
    include: productInclude,
  });
  if (!product) throw new Error('PRODUCT_NOT_FOUND');
  return formatProduct(product);
};

export const createProduct = async (data: CreateProductInput) => {
  let slug = slugify(data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = uniqueSlug(data.name, Date.now().toString(36));

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      material: data.material,
      description: data.description,
      price: Math.round(data.price * 100),
      stockQty: data.stockQty,
      lowStockThreshold: data.lowStockThreshold ?? 5,
      categoryId: data.categoryId,
      status: data.status ?? 'ACTIVE',
      sku: data.sku,
      colors: data.colors ?? [],
      sizes: data.sizes ?? [],
    },
    include: productInclude,
  });

  return formatProduct(product);
};

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  const existing = await prisma.product.findFirst({ where: { id, ...notDeleted } });
  if (!existing) throw new Error('PRODUCT_NOT_FOUND');

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.material !== undefined) updateData.material = data.material;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = Math.round(data.price * 100);
  if (data.stockQty !== undefined) updateData.stockQty = data.stockQty;
  if (data.lowStockThreshold !== undefined) updateData.lowStockThreshold = data.lowStockThreshold;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.sku !== undefined) updateData.sku = data.sku;
  if (data.colors !== undefined) updateData.colors = data.colors;
  if (data.sizes !== undefined) updateData.sizes = data.sizes;

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: productInclude,
  });

  return formatProduct(product);
};

export const softDeleteProduct = async (id: string) => {
  const existing = await prisma.product.findFirst({ where: { id, ...notDeleted } });
  if (!existing) throw new Error('PRODUCT_NOT_FOUND');

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'ARCHIVED' },
  });
};

export const addProductImages = async (
  productId: string,
  files: Express.Multer.File[]
) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, ...notDeleted },
    include: { images: { where: notDeleted } },
  });
  if (!product) throw new Error('PRODUCT_NOT_FOUND');

  const hasPrimary = product.images.some((i) => i.isPrimary);
  const maxSort = product.images.reduce((m, i) => Math.max(m, i.sortOrder), -1);

  // Upload all images to Cloudinary in parallel for speed
  const uploadResults = await Promise.all(
    files.map((file) => uploadProductImage(file.buffer, productId))
  );

  // Insert DB records sequentially to preserve sort order integrity
  const created = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const uploaded = uploadResults[i];
    const image = await prisma.productImage.create({
      data: {
        productId,
        url: uploaded.url,
        publicId: uploaded.publicId,
        mimeType: uploaded.mimeType,
        sizeBytes: uploaded.sizeBytes,
        sortOrder: maxSort + 1 + i,
        isPrimary: !hasPrimary && i === 0,
        altText: file.originalname,
      },
    });
    created.push(image);
  }

  return created;
};

export const updateProductImage = async (
  productId: string,
  imageId: string,
  data: { sortOrder?: number; isPrimary?: boolean; altText?: string }
) => {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId, ...notDeleted },
  });
  if (!image) throw new Error('IMAGE_NOT_FOUND');

  if (data.isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId, ...notDeleted },
      data: { isPrimary: false },
    });
  }

  return prisma.productImage.update({
    where: { id: imageId },
    data: {
      sortOrder: data.sortOrder,
      isPrimary: data.isPrimary,
      altText: data.altText,
    },
  });
};

export const softDeleteProductImage = async (productId: string, imageId: string) => {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId, ...notDeleted },
  });
  if (!image) throw new Error('IMAGE_NOT_FOUND');

  await deleteCloudinaryImage(image.publicId);
  await prisma.productImage.update({
    where: { id: imageId },
    data: { deletedAt: new Date(), isPrimary: false },
  });

  // Promote another image to primary if needed
  if (image.isPrimary) {
    const next = await prisma.productImage.findFirst({
      where: { productId, ...notDeleted },
      orderBy: { sortOrder: 'asc' },
    });
    if (next) {
      await prisma.productImage.update({
        where: { id: next.id },
        data: { isPrimary: true },
      });
    }
  }
};

// ─── Landing page helpers ────────────────────────────────────────────────────

export const getNewArrivals = async () => {
  const products = await prisma.product.findMany({
    where: { ...notDeleted, status: 'ACTIVE' },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: 4,
  });
  return products.map(formatProduct);
};

export const getBestSellers = async () => {
  // Aggregate order quantities per product (exclude CANCELLED orders)
  const topItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      productId: { not: null },
      order: { status: { not: 'CANCELLED' } },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 2,
  });

  const topIds = topItems
    .map((r) => r.productId)
    .filter((id): id is string => id !== null);

  const bestsellers: ReturnType<typeof formatProduct>[] = [];

  if (topIds.length > 0) {
    const products = await prisma.product.findMany({
      where: { id: { in: topIds }, ...notDeleted, status: 'ACTIVE' },
      include: productInclude,
    });
    // Preserve the ranking order returned by groupBy
    for (const id of topIds) {
      const p = products.find((p) => p.id === id);
      if (p) bestsellers.push(formatProduct(p));
    }
  }

  // Fallback: fill remaining slots from newest active products
  if (bestsellers.length < 2) {
    const excludeIds = bestsellers.map((p) => p.id);
    const fallback = await prisma.product.findMany({
      where: {
        ...notDeleted,
        status: 'ACTIVE',
        id: excludeIds.length ? { notIn: excludeIds } : undefined,
      },
      include: productInclude,
      orderBy: { createdAt: 'desc' },
      take: 2 - bestsellers.length,
    });
    bestsellers.push(...fallback.map(formatProduct));
  }

  return bestsellers;
};
