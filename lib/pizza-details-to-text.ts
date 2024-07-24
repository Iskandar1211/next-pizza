const mapSize = {
  20: 'Маленькая',
  30: 'Средняя',
  40: 'Большая',
} as const;

const mapType = {
  1: 'традиционное',
  2: 'тонкое',
} as const;

export type PizzaSizeItem = { value: string; name: string; disabled?: boolean };

export const pizzaSizes = Object.entries(mapSize).map<PizzaSizeItem>(([value, name]) => ({
  value,
  name,
}));

export const pizzaTypes = Object.entries(mapType).map<PizzaSizeItem>(([value, name]) => ({
  value,
  name,
}));

export type PizzaSize = keyof typeof mapSize;
export type PizzaType = keyof typeof mapType;

export const pizzaDetailsToText = (size: PizzaSize, type: PizzaType) => {
  const textSize = mapSize[size].toLocaleLowerCase();
  const textType = mapType[type];

  return `${size} см (${textSize}), ${textType} тесто`;
};
