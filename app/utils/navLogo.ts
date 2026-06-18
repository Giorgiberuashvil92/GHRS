import {
  shouldUseProfessionalTabLogo,
} from "./professionalDevNav";

function isRehabilitationPath(pathname: string): boolean {
  return pathname === "/rehabilitation" || pathname.startsWith("/rehabilitation/");
}

/** რეაბილიტაციის კატალოგი — allComplex, categories, complex და მ related გვერდები */
function isComplexCatalogPath(pathname: string): boolean {
  return (
    pathname === "/allComplex" ||
    pathname.startsWith("/allComplex/") ||
    pathname === "/categories" ||
    pathname.startsWith("/categories/") ||
    pathname === "/complex" ||
    pathname.startsWith("/complex/") ||
    pathname.startsWith("/subcategories/") ||
    pathname === "/section" ||
    pathname.startsWith("/section/") ||
    pathname.startsWith("/chapter/") ||
    pathname.startsWith("/sets/")
  );
}

function isBlogPath(pathname: string): boolean {
  return pathname === "/blog" || pathname.startsWith("/blog/") || pathname.startsWith("/article/");
}

export type NavbarLogoVariant = "professional" | "rehabilitation" | "blog" | "default";

export function getNavbarLogoVariant(pathname: string | null): NavbarLogoVariant {
  if (!pathname) return "default";
  if (shouldUseProfessionalTabLogo(pathname)) return "professional";
  if (isRehabilitationPath(pathname) || isComplexCatalogPath(pathname)) return "rehabilitation";
  if (isBlogPath(pathname)) return "blog";
  return "default";
}
