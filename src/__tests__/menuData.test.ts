import { describe, expect, it } from 'vitest';
import { getAllMenuItemSizes, INITIAL_MENU_ITEMS } from '../features/pos/data/menuData';

describe('Talk of the Town core POS menu', () => {
  it('has unique IDs, descriptions and correctly sized variants for chowmein and fried rice', () => {
    const ids = INITIAL_MENU_ITEMS.map(item => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(INITIAL_MENU_ITEMS.every(item => item.description?.trim())).toBe(true);
    for (const category of ['Chowmein', 'Fried Rice']) {
      const items = INITIAL_MENU_ITEMS.filter(item => item.category === category);
      expect(items).toHaveLength(5);
      expect(items.every(item => item.sizes?.map(size => size.size).join(',') === 'Small,Medium,Large')).toBe(true);
    }
  });

  it('keeps the signature dishes, prices and combo components linked to real products', () => {
    const byId = new Map(INITIAL_MENU_ITEMS.map(item => [item.id, item]));
    expect(byId.get('prod_chilly_chicken_gravy')?.price).toBe(260);
    expect(byId.get('prod_chilly_chicken_dry')?.price).toBe(250);
    expect(byId.get('prod_chilly_pork_gravy')?.price).toBe(290);
    expect(byId.get('prod_chilly_pork_dry')?.price).toBe(280);
    expect(byId.get('prod_combo_duo')?.price).toBe(75);
    expect(byId.get('prod_combo_signature')?.price).toBe(110);
    expect(byId.get('prod_combo_family')?.price).toBe(330);
    for (const combo of INITIAL_MENU_ITEMS.filter(item => item.isCombo)) {
      for (const component of combo.comboComponents || []) {
        const ids = component.isChoice ? component.options?.map(option => option.itemId) || [] : [component.itemId];
        expect(ids.length).toBeGreaterThan(0);
        for (const id of ids) expect(byId.has(id)).toBe(true);
      }
    }
  });

  it('does not seed unrelated franchise-brand products and exposes all size rows', () => {
    expect(INITIAL_MENU_ITEMS.some(item => /zinger|bucket|pepsi|kfc/i.test(item.name))).toBe(false);
    expect(getAllMenuItemSizes()).toHaveLength(38);
  });
});
