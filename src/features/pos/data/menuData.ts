import { Product, MenuItemSize, KioskAddon } from '../models/pos';
import kioskBucketImage from '../../../assets/images/kiosk_bucket_chicken_1791021849329.webp';
import kioskBoxMealImage from '../../../assets/images/kiosk_box_meal_1791021873981.webp';
import kioskBurgerImage from '../../../assets/images/kiosk_burger_combo_1791021862181.webp';
import kioskFriesImage from '../../../assets/images/kiosk_fries_peri_1791021893763.webp';

export const KIOSK_COMMON_ADDONS: KioskAddon[] = [
  { id: 'add_cheese_dip', name: 'Creamy Cheese Dip', price: 29 },
  { id: 'add_peri_sprinkle', name: 'Peri Peri Seasoning Sachet', price: 19 },
  { id: 'add_spicy_mayo', name: 'Spicy Chipotle Mayo Dip', price: 25 },
  { id: 'add_extra_cheese', name: 'Extra Cheddar Cheese Slice', price: 25 },
];

export const KIOSK_DRINK_OPTIONS = ['Pepsi (Chilled)', 'Mirinda Orange', '7UP Lemon', 'Mountain Dew', 'Diet Pepsi'];

export const INITIAL_MENU_ITEMS: Product[] = [
  // ==================== FAST FOOD & KIOSK GROUP BUCKETS (AS SEEN IN VIDEO) ====================
  {
    id: 'prod_kiosk_ultimate_bucket',
    name: 'Ultimate Savings Bucket',
    category: 'Group & Buckets',
    price: 699,
    originalPrice: 1040,
    savingsAmount: 341,
    isVeg: false,
    calories: '860 kcal',
    badge: 'Bestseller',
    imageUrl: kioskBucketImage,
    comboDescription: 'Save 33% on 4pc Hot & Crispy, 6pc Boneless Strips, 2 Dips & 2 Pepsi',
    isAvailable: true,
    active: true,
    costPrice: 280,
    spiceLevel: 'Medium',
    availableAddons: KIOSK_COMMON_ADDONS,
    drinkOptions: KIOSK_DRINK_OPTIONS,
    sizes: [
      { item_id: 'prod_kiosk_ultimate_bucket', size: 'Standard', price: 699, cost_price: 280, active: true },
      { item_id: 'prod_kiosk_ultimate_bucket', size: 'Large', price: 899, cost_price: 360, active: true }
    ]
  },
  {
    id: 'prod_kiosk_peri_bucket',
    name: '5 pc Peri Peri Leg Piece Bucket & 2 Pepsi',
    category: 'Group & Buckets',
    price: 599,
    originalPrice: 849,
    savingsAmount: 250,
    isVeg: false,
    calories: '780 kcal',
    badge: 'Save ₹250',
    imageUrl: kioskBucketImage,
    comboDescription: '5 pcs Juicy Peri Peri Leg Pieces, 2 Dips & 2 Chilled Pepsi Cans',
    isAvailable: true,
    active: true,
    costPrice: 240,
    spiceLevel: 'Hot',
    availableAddons: KIOSK_COMMON_ADDONS,
    drinkOptions: KIOSK_DRINK_OPTIONS,
    sizes: [
      { item_id: 'prod_kiosk_peri_bucket', size: 'Standard', price: 599, cost_price: 240, active: true }
    ]
  },
  {
    id: 'prod_kiosk_all_in_one_box',
    name: 'All-in-One Box Meal',
    category: 'Box Meals',
    price: 329,
    originalPrice: 480,
    savingsAmount: 151,
    isVeg: false,
    calories: '890 kcal',
    badge: 'Value King',
    imageUrl: kioskBoxMealImage,
    comboDescription: '1 Crispy Zinger Burger, 1pc Hot Chicken, Medium Peri Peri Fries & 1 Chilled Pepsi',
    isAvailable: true,
    active: true,
    costPrice: 130,
    spiceLevel: 'Medium',
    availableAddons: KIOSK_COMMON_ADDONS,
    drinkOptions: KIOSK_DRINK_OPTIONS,
    sizes: [
      { item_id: 'prod_kiosk_all_in_one_box', size: 'Standard', price: 329, cost_price: 130, active: true }
    ]
  },
  {
    id: 'prod_kiosk_tenders_box',
    name: 'Crispy Tenders Box Meal',
    category: 'Box Meals',
    price: 299,
    originalPrice: 410,
    savingsAmount: 111,
    isVeg: false,
    calories: '710 kcal',
    badge: 'Popular',
    imageUrl: kioskBoxMealImage,
    comboDescription: '3 boneless crispy chicken strips, seasoned fries, cheese dip & 1 cold beverage',
    isAvailable: true,
    active: true,
    costPrice: 115,
    spiceLevel: 'Mild',
    availableAddons: KIOSK_COMMON_ADDONS,
    drinkOptions: KIOSK_DRINK_OPTIONS,
    sizes: [
      { item_id: 'prod_kiosk_tenders_box', size: 'Standard', price: 299, cost_price: 115, active: true }
    ]
  },
  {
    id: 'prod_kiosk_zinger_burger',
    name: 'Crispy Chicken Zinger Burger',
    category: 'Burgers & Wraps',
    price: 179,
    originalPrice: 229,
    savingsAmount: 50,
    isVeg: false,
    calories: '480 kcal',
    badge: 'Chef Special',
    imageUrl: kioskBurgerImage,
    comboDescription: 'Extra crunchy chicken breast fillet with crisp lettuce & spicy pepper mayo',
    isAvailable: true,
    active: true,
    costPrice: 70,
    spiceLevel: 'Medium',
    availableAddons: KIOSK_COMMON_ADDONS,
    sizes: [
      { item_id: 'prod_kiosk_zinger_burger', size: 'Standard', price: 179, cost_price: 70, active: true },
      { item_id: 'prod_kiosk_zinger_burger', size: 'Medium', price: 219, cost_price: 85, active: true },
    ]
  },
  {
    id: 'prod_kiosk_double_zinger',
    name: 'Double Patty Cheesy Zinger',
    category: 'Burgers & Wraps',
    price: 249,
    originalPrice: 320,
    savingsAmount: 71,
    isVeg: false,
    calories: '640 kcal',
    badge: 'Monster',
    imageUrl: kioskBurgerImage,
    comboDescription: 'Two crunchy chicken patties with melted cheddar cheese slice & peri peri mayo',
    isAvailable: true,
    active: true,
    costPrice: 95,
    spiceLevel: 'Hot',
    availableAddons: KIOSK_COMMON_ADDONS,
    sizes: [
      { item_id: 'prod_kiosk_double_zinger', size: 'Standard', price: 249, cost_price: 95, active: true }
    ]
  },
  {
    id: 'prod_kiosk_paneer_burger',
    name: 'Paneer Crispy Delight Burger',
    category: 'Burgers & Wraps',
    price: 159,
    originalPrice: 199,
    savingsAmount: 40,
    isVeg: true,
    calories: '420 kcal',
    badge: 'Pure Veg',
    imageUrl: kioskBurgerImage,
    comboDescription: 'Golden crispy spiced paneer patty, thousand island spread & fresh crunchy lettuce',
    isAvailable: true,
    active: true,
    costPrice: 60,
    spiceLevel: 'Mild',
    availableAddons: KIOSK_COMMON_ADDONS,
    sizes: [
      { item_id: 'prod_kiosk_paneer_burger', size: 'Standard', price: 159, cost_price: 60, active: true }
    ]
  },
  {
    id: 'prod_kiosk_peri_fries',
    name: 'Crispy Peri Peri French Fries',
    category: 'Sides & Snacks',
    price: 99,
    originalPrice: 139,
    savingsAmount: 40,
    isVeg: true,
    calories: '310 kcal',
    badge: 'Top Pick',
    imageUrl: kioskFriesImage,
    comboDescription: 'Golden crunchy French fries tossed in authentic aromatic spicy peri peri seasoning',
    isAvailable: true,
    active: true,
    costPrice: 35,
    spiceLevel: 'Medium',
    availableAddons: KIOSK_COMMON_ADDONS,
    sizes: [
      { item_id: 'prod_kiosk_peri_fries', size: 'Medium', price: 99, cost_price: 35, active: true },
      { item_id: 'prod_kiosk_peri_fries', size: 'Large', price: 139, cost_price: 48, active: true }
    ]
  },
  {
    id: 'prod_kiosk_chicken_popcorn',
    name: 'Hot Crispy Chicken Popcorn',
    category: 'Sides & Snacks',
    price: 149,
    originalPrice: 199,
    savingsAmount: 50,
    isVeg: false,
    calories: '380 kcal',
    badge: 'Crunchy',
    imageUrl: kioskFriesImage,
    comboDescription: 'Bite-sized tender crispy chicken pieces served with smoky barbecue dip',
    isAvailable: true,
    active: true,
    costPrice: 55,
    spiceLevel: 'Medium',
    availableAddons: KIOSK_COMMON_ADDONS,
    sizes: [
      { item_id: 'prod_kiosk_chicken_popcorn', size: 'Medium', price: 149, cost_price: 55, active: true },
      { item_id: 'prod_kiosk_chicken_popcorn', size: 'Large', price: 219, cost_price: 80, active: true }
    ]
  },
  {
    id: 'prod_kiosk_choco_lava',
    name: 'Warm Molten Choco Lava Cake',
    category: 'Beverages & Desserts',
    price: 99,
    originalPrice: 129,
    savingsAmount: 30,
    isVeg: true,
    calories: '340 kcal',
    badge: 'Must Try',
    comboDescription: 'Gooey warm dark chocolate lava oozing inside a fluffy warm chocolate cake',
    isAvailable: true,
    active: true,
    costPrice: 38,
    sizes: [
      { item_id: 'prod_kiosk_choco_lava', size: 'Standard', price: 99, cost_price: 38, active: true }
    ]
  },
  {
    id: 'prod_kiosk_pepsi_can',
    name: 'Chilled Pepsi (330ml Can)',
    category: 'Beverages & Desserts',
    price: 50,
    originalPrice: 60,
    savingsAmount: 10,
    isVeg: true,
    calories: '140 kcal',
    comboDescription: 'Refreshing ice-cold carbonated beverage can',
    isAvailable: true,
    active: true,
    costPrice: 20,
    sizes: [
      { item_id: 'prod_kiosk_pepsi_can', size: 'Standard', price: 50, cost_price: 20, active: true }
    ]
  },
  {
    id: 'prod_kiosk_mirinda_can',
    name: 'Mirinda Orange (330ml Can)',
    category: 'Beverages & Desserts',
    price: 50,
    originalPrice: 60,
    savingsAmount: 10,
    isVeg: true,
    calories: '150 kcal',
    comboDescription: 'Sparkling sweet & tangy chilled orange soda',
    isAvailable: true,
    active: true,
    costPrice: 20,
    sizes: [
      { item_id: 'prod_kiosk_mirinda_can', size: 'Standard', price: 50, cost_price: 20, active: true }
    ]
  },
  // ==================== CHOWMEIN ====================
  {
    id: 'prod_chow_veg',
    name: 'Veg Chowmein',
    category: 'Chowmein',
    price: 30,
    isAvailable: true,
    active: true,
    costPrice: 15,
    sizes: [
      { item_id: 'prod_chow_veg', size: 'Small', price: 30, cost_price: 15, active: true },
      { item_id: 'prod_chow_veg', size: 'Medium', price: 45, cost_price: 22, active: true },
      { item_id: 'prod_chow_veg', size: 'Large', price: 70, cost_price: 32, active: true },
    ]
  },
  {
    id: 'prod_chow_egg',
    name: 'Egg Chowmein',
    category: 'Chowmein',
    price: 40,
    isAvailable: true,
    active: true,
    costPrice: 18,
    sizes: [
      { item_id: 'prod_chow_egg', size: 'Small', price: 40, cost_price: 18, active: true },
      { item_id: 'prod_chow_egg', size: 'Medium', price: 55, cost_price: 26, active: true },
      { item_id: 'prod_chow_egg', size: 'Large', price: 75, cost_price: 36, active: true },
    ]
  },
  {
    id: 'prod_chow_chicken',
    name: 'Chicken Chowmein',
    category: 'Chowmein',
    price: 45,
    isAvailable: true,
    active: true,
    costPrice: 22,
    sizes: [
      { item_id: 'prod_chow_chicken', size: 'Small', price: 45, cost_price: 22, active: true },
      { item_id: 'prod_chow_chicken', size: 'Medium', price: 70, cost_price: 34, active: true },
      { item_id: 'prod_chow_chicken', size: 'Large', price: 105, cost_price: 50, active: true },
    ]
  },
  {
    id: 'prod_chow_pork',
    name: 'Pork Chowmein',
    category: 'Chowmein',
    price: 55,
    isAvailable: true,
    active: true,
    costPrice: 28,
    sizes: [
      { item_id: 'prod_chow_pork', size: 'Small', price: 55, cost_price: 28, active: true },
      { item_id: 'prod_chow_pork', size: 'Medium', price: 90, cost_price: 45, active: true },
      { item_id: 'prod_chow_pork', size: 'Large', price: 135, cost_price: 65, active: true },
    ]
  },
  {
    id: 'prod_chow_mixed',
    name: 'Mixed Chowmein (Chicken+Pork)',
    category: 'Chowmein',
    price: 50,
    isAvailable: true,
    active: true,
    costPrice: 25,
    sizes: [
      { item_id: 'prod_chow_mixed', size: 'Small', price: 50, cost_price: 25, active: true },
      { item_id: 'prod_chow_mixed', size: 'Medium', price: 80, cost_price: 40, active: true },
      { item_id: 'prod_chow_mixed', size: 'Large', price: 120, cost_price: 58, active: true },
    ]
  },

  // ==================== FRIED RICE ====================
  {
    id: 'prod_fr_veg',
    name: 'Veg Fried Rice',
    category: 'Fried Rice',
    price: 30,
    isAvailable: true,
    active: true,
    costPrice: 14,
    sizes: [
      { item_id: 'prod_fr_veg', size: 'Small', price: 30, cost_price: 14, active: true },
      { item_id: 'prod_fr_veg', size: 'Medium', price: 45, cost_price: 21, active: true },
      { item_id: 'prod_fr_veg', size: 'Large', price: 60, cost_price: 28, active: true },
    ]
  },
  {
    id: 'prod_fr_egg',
    name: 'Egg Fried Rice',
    category: 'Fried Rice',
    price: 35,
    isAvailable: true,
    active: true,
    costPrice: 17,
    sizes: [
      { item_id: 'prod_fr_egg', size: 'Small', price: 35, cost_price: 17, active: true },
      { item_id: 'prod_fr_egg', size: 'Medium', price: 50, cost_price: 24, active: true },
      { item_id: 'prod_fr_egg', size: 'Large', price: 70, cost_price: 34, active: true },
    ]
  },
  {
    id: 'prod_fr_chicken',
    name: 'Chicken Fried Rice',
    category: 'Fried Rice',
    price: 40,
    isAvailable: true,
    active: true,
    costPrice: 20,
    sizes: [
      { item_id: 'prod_fr_chicken', size: 'Small', price: 40, cost_price: 20, active: true },
      { item_id: 'prod_fr_chicken', size: 'Medium', price: 65, cost_price: 32, active: true },
      { item_id: 'prod_fr_chicken', size: 'Large', price: 100, cost_price: 48, active: true },
    ]
  },
  {
    id: 'prod_fr_pork',
    name: 'Pork Fried Rice',
    category: 'Fried Rice',
    price: 55,
    isAvailable: true,
    active: true,
    costPrice: 28,
    sizes: [
      { item_id: 'prod_fr_pork', size: 'Small', price: 55, cost_price: 28, active: true },
      { item_id: 'prod_fr_pork', size: 'Medium', price: 85, cost_price: 42, active: true },
      { item_id: 'prod_fr_pork', size: 'Large', price: 130, cost_price: 62, active: true },
    ]
  },
  {
    id: 'prod_fr_mixed',
    name: 'Mixed Fried Rice (Chicken+Pork)',
    category: 'Fried Rice',
    price: 45,
    isAvailable: true,
    active: true,
    costPrice: 23,
    sizes: [
      { item_id: 'prod_fr_mixed', size: 'Small', price: 45, cost_price: 23, active: true },
      { item_id: 'prod_fr_mixed', size: 'Medium', price: 75, cost_price: 38, active: true },
      { item_id: 'prod_fr_mixed', size: 'Large', price: 115, cost_price: 56, active: true },
    ]
  },

  // ==================== CHILLY SPECIALS ====================
  {
    id: 'prod_chilly_chicken_gravy',
    name: 'Chicken Chilly Gravy',
    category: 'Specials',
    price: 260,
    isAvailable: true,
    active: true,
    costPrice: 110,
    sizes: [
      { item_id: 'prod_chilly_chicken_gravy', size: 'Standard', price: 260, cost_price: 110, active: true }
    ]
  },
  {
    id: 'prod_chilly_chicken_dry',
    name: 'Chicken Chilly Dry',
    category: 'Specials',
    price: 250,
    isAvailable: true,
    active: true,
    costPrice: 105,
    sizes: [
      { item_id: 'prod_chilly_chicken_dry', size: 'Standard', price: 250, cost_price: 105, active: true }
    ]
  },
  {
    id: 'prod_chilly_pork_gravy',
    name: 'Pork Chilly Gravy',
    category: 'Specials',
    price: 290,
    isAvailable: true,
    active: true,
    costPrice: 125,
    sizes: [
      { item_id: 'prod_chilly_pork_gravy', size: 'Standard', price: 290, cost_price: 125, active: true }
    ]
  },
  {
    id: 'prod_chilly_pork_dry',
    name: 'Pork Chilly Dry',
    category: 'Specials',
    price: 280,
    isAvailable: true,
    active: true,
    costPrice: 120,
    sizes: [
      { item_id: 'prod_chilly_pork_dry', size: 'Standard', price: 280, cost_price: 120, active: true }
    ]
  },
  {
    id: 'prod_chilly_bites',
    name: 'Chilly Chicken Bites',
    category: 'Specials',
    price: 50,
    isAvailable: true,
    active: true,
    costPrice: 22,
    isSubItem: true,
    sizes: [
      { item_id: 'prod_chilly_bites', size: 'Standard', price: 50, cost_price: 22, active: true }
    ]
  },

  // ==================== COMBO MEALS ====================
  {
    id: 'prod_combo_duo',
    name: 'Duo Combo',
    category: 'Combo Meals',
    price: 75,
    isAvailable: true,
    active: true,
    costPrice: 42,
    isCombo: true,
    comboDescription: 'Small Chowmein + Small Fried Rice (Chicken)',
    sizes: [
      { item_id: 'prod_combo_duo', size: 'Standard', price: 75, cost_price: 42, active: true }
    ],
    comboComponents: [
      { itemId: 'prod_chow_chicken', name: 'Small Chicken Chowmein', size: 'Small', quantity: 1 },
      { itemId: 'prod_fr_chicken', name: 'Small Chicken Fried Rice', size: 'Small', quantity: 1 }
    ]
  },
  {
    id: 'prod_combo_signature',
    name: 'Signature Combo',
    category: 'Combo Meals',
    price: 110,
    isAvailable: true,
    active: true,
    costPrice: 56,
    isCombo: true,
    comboDescription: 'Medium Chowmein OR Fried Rice (Chicken) + Chilly Chicken Bites',
    sizes: [
      { item_id: 'prod_combo_signature', size: 'Standard', price: 110, cost_price: 56, active: true }
    ],
    comboComponents: [
      {
        itemId: 'choice_sig_base',
        name: 'Medium Chicken Chowmein or Fried Rice',
        quantity: 1,
        isChoice: true,
        options: [
          { itemId: 'prod_chow_chicken', name: 'Medium Chicken Chowmein', size: 'Medium' },
          { itemId: 'prod_fr_chicken', name: 'Medium Chicken Fried Rice', size: 'Medium' }
        ]
      },
      { itemId: 'prod_chilly_bites', name: 'Chilly Chicken Bites', size: 'Standard', quantity: 1 }
    ]
  },
  {
    id: 'prod_combo_family',
    name: 'Family Combo',
    category: 'Combo Meals',
    price: 330,
    isAvailable: true,
    active: true,
    costPrice: 155,
    isCombo: true,
    comboDescription: 'Large Chowmein OR Fried Rice (Chicken) + Full Chicken Chilly (Dry)',
    sizes: [
      { item_id: 'prod_combo_family', size: 'Standard', price: 330, cost_price: 155, active: true }
    ],
    comboComponents: [
      {
        itemId: 'choice_fam_base',
        name: 'Large Chicken Chowmein or Fried Rice',
        quantity: 1,
        isChoice: true,
        options: [
          { itemId: 'prod_chow_chicken', name: 'Large Chicken Chowmein', size: 'Large' },
          { itemId: 'prod_fr_chicken', name: 'Large Chicken Fried Rice', size: 'Large' }
        ]
      },
      { itemId: 'prod_chilly_chicken_dry', name: 'Full Chicken Chilly (Dry)', size: 'Standard', quantity: 1 }
    ]
  }
];

export const getAllMenuItemSizes = (): MenuItemSize[] => {
  const sizes: MenuItemSize[] = [];
  for (const item of INITIAL_MENU_ITEMS) {
    if (item.sizes) {
      for (const s of item.sizes) {
        sizes.push({
          ...s,
          id: `${s.item_id}_${s.size.toLowerCase()}`
        });
      }
    }
  }
  return sizes;
};
