export const getTabNameFromPathname = (pathname: string) => {
  const path = pathname.split("/").pop();

  if (!path) {
    return "";
  }

  return path?.replace(/\?.*$/, "");
};
