import { ICartItem } from '@/store/cart';

interface Props {
  name: string;
  pizzaSize?: number | null;
  type?: number | null;
  ingredients?: ICartItem['ingredients'];
}

export const CartItemInfo: React.FC<Props> = ({ name, pizzaSize, type, ingredients }) => {
  const details = [];

  if (pizzaSize) {
    const typeName = type === 1 ? 'Традиционное' : 'Тонкое';
    details.push(`${typeName} ${pizzaSize} см`);
  }

  if (ingredients) {
    details.push(...ingredients.map((ingredient) => ingredient.name));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex-1 leading-6">{name}</h2>
      </div>
      <p className="text-xs text-gray-400">{details.join(', ')}</p>
    </div>
  );
};
