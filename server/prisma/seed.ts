import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: 'Kitchen & Dining', slug: 'kitchen-dining', sortOrder: 1 },
  { name: 'Textiles', slug: 'textiles', sortOrder: 2 },
  { name: 'Wellness', slug: 'wellness', sortOrder: 3 },
  { name: 'Home Decor', slug: 'home-decor', sortOrder: 4 },
  { name: 'Lighting', slug: 'lighting', sortOrder: 5 },
];

const DELIVERY_ZONES = [
  { code: 'amman-west', name: 'Amman – West', fee: 350 },
  { code: 'amman-east', name: 'Amman – East', fee: 350 },
  { code: 'zarqa', name: 'Zarqa', fee: 500 },
  { code: 'aqaba', name: 'Aqaba', fee: 800 },
];

const PRODUCTS = [
  {
    name: 'Clay Studio Teapot',
    slug: 'clay-studio-teapot',
    material: 'Artisanal Ceramic',
    categorySlug: 'kitchen-dining',
    price: 8500,
    stockQty: 24,
    description:
      'Hand-thrown stoneware with a unique matte glaze and a balanced pour spout.',
  },
  {
    name: 'Linen Napkin Set',
    slug: 'linen-napkin-set',
    material: 'Stone Washed',
    categorySlug: 'textiles',
    price: 4200,
    stockQty: 15,
    description:
      'Set of four pre-washed Belgian linen napkins in our signature stone colour.',
  },
  {
    name: 'Walnut Serving Bowl',
    slug: 'walnut-serving-bowl',
    material: 'Sustainable Walnut',
    categorySlug: 'kitchen-dining',
    price: 12000,
    stockQty: 0,
    description:
      'Each bowl is carved from a single piece of sustainable American walnut.',
  },
  {
    name: 'Botanical Soak',
    slug: 'botanical-soak',
    material: 'Organic Botanicals',
    categorySlug: 'wellness',
    price: 3400,
    stockQty: 45,
    description:
      'Mineral-rich salts infused with organic lavender and chamomile for deep relaxation.',
  },
  {
    name: 'Santal Candle',
    slug: 'santal-candle',
    material: 'Coconut Wax',
    categorySlug: 'home-decor',
    price: 5800,
    stockQty: 5,
    description:
      'A warm, woody blend of sandalwood and papyrus in a concrete vessel.',
  },
];

async function main() {
  // Store settings singleton
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      currency: 'JOD',
      defaultDeliveryFee: 350,
      lowStockThreshold: 5,
    },
    update: { lowStockThreshold: 5 },
  });

  // Delivery zones
  for (const zone of DELIVERY_ZONES) {
    await prisma.deliveryZone.upsert({
      where: { code: zone.code },
      create: zone,
      update: { name: zone.name, fee: zone.fee, isActive: true },
    });
  }

  // Categories
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: { name: cat.name, sortOrder: cat.sortOrder },
    });
    categoryMap.set(cat.slug, row.id);
  }

  // Products
  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug)!;
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name,
        slug: p.slug,
        material: p.material,
        description: p.description,
        price: p.price,
        stockQty: p.stockQty,
        lowStockThreshold: 5,
        categoryId,
        status: 'ACTIVE',
      },
      update: {
        name: p.name,
        material: p.material,
        description: p.description,
        price: p.price,
        stockQty: p.stockQty,
        lowStockThreshold: 5,
        categoryId,
      },
    });
  }

  // Admin user
  const email = process.env.ADMIN_EMAIL || 'admin@tiko.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const fullName = process.env.ADMIN_FULL_NAME || 'Tiko Admin';

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
      },
    });
    console.log(`🌱 Admin account created: ${email}`);
  } else {
    console.log(`✅ Admin account exists: ${email}`);
  }

  console.log('🌱 Seed completed: categories, products, delivery zones, store settings');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
