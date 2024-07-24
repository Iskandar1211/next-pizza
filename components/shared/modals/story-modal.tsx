'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';
import Stories from 'stories-react';
import 'stories-react/dist/index.css';

interface Props {
  items: any[];
  activeIndex: number;
  className?: string;
}

export const StoryModal: React.FC<Props> = ({ className, items, activeIndex }) => {
  return (
    <div
      className={cn(
        className,
        'flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/90 py-10',
      )}>
      <div className="h-full relative w-[540px] overflow-hidden rounded">
        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center absolute top-4 right-4 z-10">
          <X className="w-5 h-5 text-gray-400" />
        </button>
        <Stories currentIndex={activeIndex} width="540px" height="100%" stories={items} />
      </div>
    </div>
  );
};
