import type { MenuItemSize, Product } from '../models/pos';

interface PriceCost {
  size: 'Small' | 'Medium' | 'Large' | 'Standard';
  price: number;
  cost: number;
}

function sizesFor(itemId: string, values: PriceCost[]): MenuItemSize[] {
  return values.map(value => ({
    item_id: itemId,
    size: value.size,
    price: value.price,
    cost_price: value.cost,
    active: true,
  }));
}

function sizedProduct(
  id: string,
  name: string,
  description: string,
  category: string,
  prices: PriceCost[],
  isVeg: boolean,
): Product {
  return {
    id,
    name,
    description,
    category,
    price: prices[0].price,
    costPrice: prices[0].cost,
    isVeg,
    isAvailable: true,
    active: true,
    sizes: sizesFor(id, prices),
  };
}

const S = (price: number, cost: number): PriceCost => ({ size: 'Small', price, cost });
const M = (price: number, cost: number): PriceCost => ({ size: 'Medium', price, cost });
const L = (price: number, cost: number): PriceCost => ({ size: 'Large', price, cost });
const STANDARD = (price: number, cost: number): PriceCost => ({ size: 'Standard', price, cost });

const CHOWMEIN = [
  sizedProduct('prod_chow_veg', 'Veg Chowmein', 'Fresh wok-tossed noodles with seasonal vegetables, aromatics and Talk of the Town house seasoning.', 'Chowmein', [S(30, 15), M(45, 22), L(70, 32)], true),
  sizedProduct('prod_chow_egg', 'Egg Chowmein', 'Wok-tossed noodles with egg, vegetables and house seasoning.', 'Chowmein', [S(40, 18), M(55, 26), L(75, 36)], false),
  sizedProduct('prod_chow_chicken', 'Chicken Chowmein', 'Made-to-order noodles with chicken, crisp vegetables and a savoury house wok sauce.', 'Chowmein', [S(45, 22), M(70, 34), L(105, 50)], false),
  sizedProduct('prod_chow_pork', 'Pork Chowmein', 'Wok-tossed noodles with pork, fresh vegetables and a peppery house seasoning.', 'Chowmein', [S(55, 28), M(90, 45), L(135, 65)], false),
  sizedProduct('prod_chow_mixed', 'Mixed Chowmein (Chicken + Pork)', 'A generous wok-tossed mix of chicken and pork with noodles and seasonal vegetables.', 'Chowmein', [S(50, 25), M(80, 40), L(120, 58)], false),
];

const FRIED_RICE = [
  sizedProduct('prod_fr_veg', 'Veg Fried Rice', 'Freshly wok-fried rice with seasonal vegetables and house seasoning.', 'Fried Rice', [S(30, 14), M(45, 21), L(60, 28)], true),
  sizedProduct('prod_fr_egg', 'Egg Fried Rice', 'Wok-fried rice with egg, vegetables and a light savoury seasoning.', 'Fried Rice', [S(35, 17), M(50, 24), L(70, 34)], false),
  sizedProduct('prod_fr_chicken', 'Chicken Fried Rice', 'Made-to-order wok-fried rice with chicken, vegetables and house seasoning.', 'Fried Rice', [S(40, 20), M(65, 32), L(100, 48)], false),
  sizedProduct('prod_fr_pork', 'Pork Fried Rice', 'Wok-fried rice with pork, fresh vegetables and a peppery finish.', 'Fried Rice', [S(55, 28), M(85, 42), L(130, 62)], false),
  sizedProduct('prod_fr_mixed', 'Mixed Fried Rice (Chicken + Pork)', 'A generous wok-fried mix of chicken and pork with rice and seasonal vegetables.', 'Fried Rice', [S(45, 23), M(75, 38), L(115, 56)], false),
];

const CHILLY = [
  sizedProduct('prod_chilly_chicken_gravy', 'Chilly Chicken — Gravy', 'Talk of the Town signature-style chicken in a glossy chilli-garlic gravy. Heat level and garnish should be confirmed with the kitchen.', 'Specials', [STANDARD(260, 110)], false),
  sizedProduct('prod_chilly_chicken_dry', 'Chilly Chicken — Dry', 'Crisp-edged chicken tossed dry in a bold chilli-garlic sauce; served hot from the wok.', 'Specials', [STANDARD(250, 105)], false),
  sizedProduct('prod_chilly_pork_gravy', 'Chilly Pork — Gravy', 'Pork tossed in a savoury chilli-garlic gravy with a balanced sweet-sour finish.', 'Specials', [STANDARD(290, 125)], false),
  sizedProduct('prod_chilly_pork_dry', 'Chilly Pork — Dry', 'Pork finished dry in a punchy chilli-garlic wok sauce.', 'Specials', [STANDARD(280, 120)], false),
  {
    ...sizedProduct('prod_chilly_bites', 'Chilly Chicken Bites', 'Small chicken bites tossed in the house chilli sauce; a side portion for combos.', 'Specials', [STANDARD(50, 22)], false),
    isSubItem: true,
  },
];

const COMBOS: Product[] = [
  {
    ...sizedProduct('prod_combo_duo', 'Duo Combo', 'A value pair: small Chicken Chowmein plus small Chicken Fried Rice.', 'Combo Meals', [STANDARD(75, 42)], false),
    isCombo: true,
    comboDescription: 'Small Chicken Chowmein + Small Chicken Fried Rice',
    comboComponents: [
      { itemId: 'prod_chow_chicken', name: 'Small Chicken Chowmein', size: 'Small', quantity: 1 },
      { itemId: 'prod_fr_chicken', name: 'Small Chicken Fried Rice', size: 'Small', quantity: 1 },
    ],
  },
  {
    ...sizedProduct('prod_combo_signature', 'Signature Combo', 'Choose a medium chicken wok favourite, paired with Chilly Chicken Bites.', 'Combo Meals', [STANDARD(110, 56)], false),
    isCombo: true,
    comboDescription: 'Medium Chicken Chowmein or Fried Rice + Chilly Chicken Bites',
    comboComponents: [
      {
        itemId: 'choice_sig_base',
        name: 'Choose a medium chicken base',
        quantity: 1,
        isChoice: true,
        options: [
          { itemId: 'prod_chow_chicken', name: 'Medium Chicken Chowmein', size: 'Medium' },
          { itemId: 'prod_fr_chicken', name: 'Medium Chicken Fried Rice', size: 'Medium' },
        ],
      },
      { itemId: 'prod_chilly_bites', name: 'Chilly Chicken Bites', size: 'Standard', quantity: 1 },
    ],
  },
  {
    ...sizedProduct('prod_combo_family', 'Family Combo', 'A sharing meal: one large chicken chowmein or fried rice, with Chilly Chicken Dry.', 'Combo Meals', [STANDARD(330, 155)], false),
    isCombo: true,
    comboDescription: 'Large Chicken Chowmein or Fried Rice + Chilly Chicken (Dry)',
    comboComponents: [
      {
        itemId: 'choice_fam_base',
        name: 'Choose a large chicken base',
        quantity: 1,
        isChoice: true,
        options: [
          { itemId: 'prod_chow_chicken', name: 'Large Chicken Chowmein', size: 'Large' },
          { itemId: 'prod_fr_chicken', name: 'Large Chicken Fried Rice', size: 'Large' },
        ],
      },
      { itemId: 'prod_chilly_chicken_dry', name: 'Chilly Chicken — Dry', size: 'Standard', quantity: 1 },
    ],
  },
];

export const INITIAL_MENU_ITEMS: Product[] = [...CHOWMEIN, ...FRIED_RICE, ...CHILLY, ...COMBOS];

export const getAllMenuItemSizes = (): MenuItemSize[] => INITIAL_MENU_ITEMS.flatMap(item =>
  (item.sizes || []).map(size => ({
    ...size,
    id: `${size.item_id}_${size.size.toLowerCase()}`,
  })),
);
