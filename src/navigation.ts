/** Whether a nav entry's `href` points at the page being rendered at `pathname`. */
export function isCurrentPage(pathname: string, href: string): boolean {
  return normalise(pathname) === normalise(href);
}

function normalise(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}
