/**
 * fix-slugs.ts
 * ─────────────────────────────────────────────────────────────
 * One-time script to repair broken product slugs in the database.
 *
 * Usage (from the /server directory):
 *   npx tsx src/scripts/fix-slugs.ts
 * ─────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import prisma from '../config/db.js';

// ── Same slugify logic as the main app ──────────────────────────────────────
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// UUID pattern — if a slug looks like this it was never properly set
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function main() {
  console.log('🔍  Scanning products for broken slugs...\n');

  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });

  const broken = products.filter(
    (p) =>
      !p.slug ||
      UUID_REGEX.test(p.slug) ||
      p.slug.trim() === ''
  );

  if (broken.length === 0) {
    console.log('✅  All slugs look correct — nothing to fix.');
    return;
  }

  console.log(`⚠️   Found ${broken.length} product(s) with broken slugs:\n`);

  for (const product of broken) {
    let newSlug = slugify(product.name);

    // Make unique if a conflict exists
    const conflict = await prisma.product.findFirst({
      where: { slug: newSlug, id: { not: product.id } },
    });
    if (conflict) {
      newSlug = `${newSlug}-${product.id.slice(0, 8)}`;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { slug: newSlug },
    });

    console.log(
      `  ✔  "${product.name}"\n     old: "${product.slug || '(empty)'}"\n     new: "${newSlug}"\n`
    );
  }

  console.log('🎉  Done! All slugs have been repaired.');
}

main()
  .catch((e) => {
    console.error('❌  Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
