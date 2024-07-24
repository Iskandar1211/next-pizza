import { z } from "zod";

export const CreateIngredientFormSchema = z.object({
  name: z.string(),
  imageUrl: z.string().optional(),
  price: z.string(),
});

export type CreateIngredientFormValues = z.infer<
  typeof CreateIngredientFormSchema
>;
