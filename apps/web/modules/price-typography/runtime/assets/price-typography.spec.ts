import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesheet = readFileSync(
  resolve(process.cwd(), 'modules/price-typography/runtime/assets/price-typography.css'),
  'utf8',
);

describe('price typography selector contract', () => {
  it.each([
    "data-testid='price'",
    "data-testid='product-card-vertical-price'",
    "data-testid='search-suggestion-product'",
    "data-testid='cart-item-price'",
    "data-testid='product-full-price'",
    "data-testid='order-property-surcharge'",
    "data-testid='shipping-method-list'",
    "data-testid='subtotal'",
    "data-testid='shipping'",
    "data-testid='coupon-value'",
    "data-testid='vat'",
    "data-testid='total'",
  ])('targets the commerce hook %s', (selector) => {
    expect(stylesheet).toContain(selector);
  });

  it.each(['body {', 'button {', 'input {', '[data-testid="total-label"]'])(
    'does not broaden styling through %s',
    (selector) => {
      expect(stylesheet).not.toContain(selector);
    },
  );
});
