export const getSearchParams = <T>(url: string) => {
  const { searchParams } = new URL(url);

  const params = Object.fromEntries(searchParams);

  return params as T;
};
