/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://kaelsolomon.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
};
