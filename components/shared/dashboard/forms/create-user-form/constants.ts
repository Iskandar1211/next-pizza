import { z } from 'zod';

export const CreateUserFormSchema = z.object({
  fullName: z.string().min(4, { message: 'Введите корректное имя' }),
  email: z.string().email({ message: 'Введите корректный EMail' }),
  password: z.string().min(4, { message: 'Введите корректный пароль' }),
  role: z.string().min(4, { message: 'Выберите роль' }),
});

export type CreateUserFormValues = z.infer<typeof CreateUserFormSchema>;
