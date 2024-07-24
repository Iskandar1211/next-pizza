'use client';

import {
  deleteCategory,
  deleteIngredient,
  deleteProduct,
  deleteProductItem,
  deleteUser,
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import React from 'react';

interface Props {
  id: number;
  type: 'user' | 'category' | 'product' | 'ingredient' | 'product-items';
  className?: string;
}

export const DeleteButton: React.FC<Props> = ({ id, type, className }) => {
  const onClickRemove = async (id: number) => {
    if (type === 'user') {
      await deleteUser(id);
    } else if (type === 'category') {
      await deleteCategory(id);
    } else if (type === 'product') {
      await deleteProduct(id);
    } else if (type === 'ingredient') {
      await deleteIngredient(id);
    } else if (type === 'product-items') {
      await deleteProductItem(id);
    }
  };

  return (
    <Button onClick={() => onClickRemove(id)} className="w-10 h-10 p-0 text-white">
      <Trash2 size={16} />
    </Button>
  );
};
