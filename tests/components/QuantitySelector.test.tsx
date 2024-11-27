import { render, screen } from '@testing-library/react';

import QuantitySelector from '../../src/components/QuantitySelector';
import { Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';

import { db } from '../mocks/db';
import { mockUserEvent, queryBtn } from '../shared/helpers';

describe('QuantitySelector', () => {
  let productMock: Product;

  beforeAll(() => productMock = db.product.create());

  afterAll(() => db.product.delete({ where: { id: { equals: productMock.id } } }));

  function renderComponent(product = productMock): void {
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );
  }

  async function addToCart(): Promise<void> {
    await mockUserEvent().click(queryBtn());
  }

  function getDecrementBtn(): HTMLElement {
    return screen.getByRole('button', { name: '-' });
  }

  async function decrementQuantity(): Promise<void> {
    await mockUserEvent().click(getDecrementBtn());
  }

  function getQuantity(): HTMLElement {
    return screen.getByRole('status');
  }

  function getIncrementBtn(): HTMLElement {
    return screen.getByRole('button', { name: '+' });
  }

  async function incrementQuantity(): Promise<void> {
    await mockUserEvent().click(getIncrementBtn());
  }

  function validateAddBtnInDocument(): void {
    expect(screen.queryByRole('button', { name: /add/i })).toBeInTheDocument();
  }

  it('should render button for adding product to cart', () => {
    renderComponent({} as Product);

    validateAddBtnInDocument();
  });

  it('should add product to cart', async () => {
    renderComponent();

    await addToCart();

    expect(getDecrementBtn()).toBeInTheDocument();
    expect(getQuantity()).toHaveTextContent('1');
    expect(getIncrementBtn()).toBeInTheDocument();
  });

  describe('should <x> product count in cart', () => {
    it('<increment>', async () => {
      renderComponent();

      await addToCart();
      await incrementQuantity();

      expect(getQuantity()).toHaveTextContent('2');
    });

    it('<decrement>', async () => {
      renderComponent();

      await addToCart();
      await incrementQuantity();
      await decrementQuantity();

      expect(getQuantity()).toHaveTextContent('1');
    });
  });

  it('should remove product from cart', async () => {
    renderComponent();

    await addToCart();
    await decrementQuantity();

    validateAddBtnInDocument();
  });
});