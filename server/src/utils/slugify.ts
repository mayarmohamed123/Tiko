export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const uniqueSlug = (base: string, suffix?: string): string => {
  const slug = slugify(base);
  return suffix ? `${slug}-${suffix}` : slug;
};
