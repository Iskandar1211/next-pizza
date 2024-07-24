"use client";

import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/shared/form/form-input";
import { useRouter, useParams } from "next/navigation";
import {
  createProduct,
  createUser,
  updateProduct,
  updateUser,
} from "@/app/actions";
import toast from "react-hot-toast";
import { DashboardFormHeader } from "../../dashboard-form-header";
import {
  CreateProductFormSchema,
  CreateProductFormValues,
} from "@/components/shared/dashboard/forms/create-product-form/constants";
import { Product } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

interface Props {
  values?: Product;
}

export const CreateProductForm: React.FC<Props> = ({ values }) => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateProductFormValues>({
    defaultValues: {
      name: values?.name || "",
      imageUrl: values?.imageUrl || "",
      category: String(values?.categoryId),
    },
    resolver: zodResolver(CreateProductFormSchema),
  });

  const onSubmit: SubmitHandler<CreateProductFormValues> = async (data) => {
    try {
      setLoading(true);

      const fields = {
        ...data,
        category: { connect: { id: Number(data.category) } },
      };

      if (params.id) {
        await updateProduct(+params.id, fields);
      } else {
        await createProduct(fields);
        router.push("/dashboard/products");
      }

      console.log(data);
    } catch (error) {
      console.log("Error [CREATE_PRODUCT]", error);
      toast.error("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const onUploadSuccess = (url: string) => {
    form.setValue("imageUrl", url);
    toast.success("Файл успешно загружена!", {
      icon: "👏",
    });
  };

  const onUploadError = (error: Error) => {
    console.log(error);
    toast.error("Не удалось загрузить файл", {
      icon: "😩",
    });
  };

  const onClickRemoveImage = () => {
    form.setValue("imageUrl", "");
  };

  const imageUrl = form.watch("imageUrl");

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardFormHeader isEdit={!!values} loading={loading} />
        <div className="flex items-center border shadow-sm rounded-lg grid grid-cols-2 gap-5 p-5">
          <div>
            <FormInput name="name" label="Название продукта" required />
            <FormInput name="category" label="Категория" required />
          </div>

          {imageUrl ? (
            <div className="relative w-40 h-40">
              <img className="object-cover rounded" src={imageUrl} />
              <button
                onClick={onClickRemoveImage}
                className="absolute top-2 right-2 bg-red-600 rounded-sm p-2"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => onUploadSuccess(res[0].url)}
                onUploadError={onUploadError}
              />
              {form.formState.errors.imageUrl && (
                <p className="text-red-500 text-sm mt-2">
                  {form.formState.errors.imageUrl.message}
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
