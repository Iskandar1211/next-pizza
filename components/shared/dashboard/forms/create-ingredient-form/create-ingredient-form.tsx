"use client";

import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/shared/form/form-input";
import { useRouter, useParams } from "next/navigation";
import {
  createIngredient,
  createProduct,
  createUser,
  updateIngredient,
  updateProduct,
  updateUser,
} from "@/app/actions";
import toast from "react-hot-toast";
import { DashboardFormHeader } from "../../dashboard-form-header";
import {
  CreateProductFormSchema,
  CreateProductFormValues,
} from "@/components/shared/dashboard/forms/create-product-form/constants";
import { Ingredient, Product } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import {
  CreateIngredientFormSchema,
  CreateIngredientFormValues,
} from "@/components/shared/dashboard/forms/create-ingredient-form/constants";

interface Props {
  values?: Ingredient;
}

export const CreateIngredientForm: React.FC<Props> = ({ values }) => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<CreateIngredientFormValues>({
    defaultValues: {
      name: values?.name || "",
      imageUrl: values?.imageUrl || "",
      price: values?.price ? String(values?.price) : "",
    },
    resolver: zodResolver(CreateIngredientFormSchema),
  });

  const onSubmit: SubmitHandler<CreateIngredientFormValues> = async (data) => {
    try {
      setLoading(true);

      const fields = {
        ...data,
        price: Number(data.price),
      };

      if (params.id) {
        await updateIngredient(+params.id, fields);
      } else {
        await createIngredient(fields);
        router.push("/dashboard/ingredients");
      }

      console.log(data);
    } catch (error) {
      console.log("Error [CREATE_INGREDIENT]", error);
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
            <FormInput name="name" label="Название" required />
            <FormInput name="price" label="Цена" required />
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
