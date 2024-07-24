import { z } from 'zod';

export const orderFormSchema = z.object({
  firstName: z.string().min(2, { message: 'Введите корректное имя' }),
  lastName: z.string().min(2, { message: 'Введите корректную фамилию' }),
  email: z.string().email({ message: 'Введите корректную почту' }),
  phone: z.string().min(10, { message: 'Введите корректный номер телефона' }),
  address: z.string().min(5, { message: 'Введите корректный адрес' }),
  comment: z.string().optional(),
});

export type TFormOrderData = z.infer<typeof orderFormSchema>;
