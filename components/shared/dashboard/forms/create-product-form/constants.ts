import { z } from "zod";

export const CreateProductFormSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  category: z.string(),
});

export type CreateProductFormValues = z.infer<typeof CreateProductFormSchema>;
