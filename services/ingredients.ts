import { Ingredient } from '@prisma/client';
import { axiosInstance } from './instance';

export const getAll = async () => {
  const { data } = await axiosInstance.get<Ingredient[]>('/ingredients');

  return data;
};
