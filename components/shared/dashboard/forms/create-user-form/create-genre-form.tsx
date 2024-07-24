'use client';

import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormInput } from '@/components/shared/form/form-input';
import type { User, UserRole } from '@prisma/client';
import { CreateUserFormSchema, CreateUserFormValues } from './constants';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { createUser, updateUser } from '@/app/actions';
import toast from 'react-hot-toast';
import { DashboardFormHeader } from '../../dashboard-form-header';

interface Props {
  values?: User;
}

export const CreateUserForm: React.FC<Props> = ({ values }) => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateUserFormValues>({
    defaultValues: {
      fullName: values?.fullName || '',
      email: values?.email || '',
      password: '',
      role: values?.role || '',
    },
    resolver: zodResolver(CreateUserFormSchema),
  });

  const onSubmit: SubmitHandler<CreateUserFormValues> = async (data) => {
    try {
      setLoading(true);

      const values = {
        ...data,
        role: data.role as UserRole,
      };

      if (params.id) {
        await updateUser(+params.id, values);
      } else {
        await createUser(values);
        router.push('/dashboard/users');
      }

      console.log(data);
    } catch (error) {
      console.log('Error [CREATE_USER]', error);
      toast.error('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardFormHeader isEdit={!!values} loading={loading} />
        <div className="border shadow-sm rounded-lg grid grid-cols-2 gap-5 p-5">
          <FormInput name="fullName" label="ФИО" required />
          <FormInput name="email" label="E-Mail" required />
          <FormInput name="role" label="Роль" required />
          <FormInput name="password" label="Пароль" required />
        </div>
      </form>
    </FormProvider>
  );
};
