import { z } from 'zod';

export const CreateProductItemFormSchema = z.object({
  price: z.string(),
  size: z.string().optional(),
  pizzaType: z.string().optional(),
  productId: z.string(),
});

export type CreateProductItemFormValues = z.infer<typeof CreateProductItemFormSchema>;
