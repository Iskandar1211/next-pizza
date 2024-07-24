'use client';

import React from 'react';
import { Folder, LayoutDashboard, Leaf, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface Props {
  className?: string;
}

function isSubPath(subPath: string, parentPath: string) {
  if (subPath === '/dashboard' && parentPath === '/dashboard') {
    return true;
  }

  return subPath !== '/dashboard' && (subPath === parentPath || parentPath.startsWith(subPath));
}

const items = [
  {
    text: 'Пользователи',
    icon: <Users size={16} />,
    href: '/dashboard/users',
  },
  {
    text: 'Категории',
    icon: <Folder size={16} />,
    href: '/dashboard/categories',
  },
  {
    text: 'Продукты',
    icon: <Package size={16} />,
    href: '/dashboard/products',
  },
  {
    text: 'Вариации',
    icon: <LayoutDashboard size={16} />,
    href: '/dashboard/product-items',
  },
  {
    text: 'Ингредиенты',
    icon: <Leaf size={16} />,
    href: '/dashboard/ingredients',
  },
  {
    text: 'Заказы',
    icon: <ShoppingCart size={16} />,
    href: '/dashboard/orders',
  },
];

export const DashboardMenu: React.FC<Props> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav className={cn('grid items-start px-4 font-medium text-sm', className)}>
      {items.map((item) => (
        <Link
          key={item.text}
          className={cn(
            'flex gap-3 rounded-[8px] px-3 py-2 text-gray-900 transition-all hover:text-gray-900',
            {
              'bg-gray-200': isSubPath(item.href, pathname),
            },
          )}
          href={item.href}>
          {item.icon}
          {item.text}
        </Link>
      ))}
    </nav>
  );
};
