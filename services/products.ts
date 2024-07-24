import { Product } from '@prisma/client';
import { axiosInstance } from './instance';

export const search = async (query: string) => {
  const { data } = await axiosInstance.get<Product[]>('/products/search', { params: { query } });

  return data;
};
