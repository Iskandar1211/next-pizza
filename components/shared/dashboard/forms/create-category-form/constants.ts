import { z } from 'zod';

export const CreateCategoryFormSchema = z.object({
  name: z.string(),
});

export type CreateCategoryFormValues = z.infer<typeof CreateCategoryFormSchema>;
