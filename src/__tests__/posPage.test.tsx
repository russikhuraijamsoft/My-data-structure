import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
vi.mock('../core/firebase/firebaseConfig', () => ({ db: null }));
import { PosPage } from '../features/pos/pages/PosPage';
it('shows the cash entry and order type controls required to complete checkout', () => {
  const html = renderToStaticMarkup(<MemoryRouter><PosPage /></MemoryRouter>);
  expect(html).toContain('aria-label="Cash received"');
  expect(html).toContain('aria-label="Order type"');
  expect(html).toContain('Record cash payment');
});
