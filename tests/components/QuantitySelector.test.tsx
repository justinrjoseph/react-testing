import { render } from '@testing-library/react';

import QuantitySelector from '../../src/components/QuantitySelector';
import { Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';

import { deleteMockProduct, mockProduct } from '../helpers/data';
import { getStatus, mockUserEvent, queryBtn } from '../helpers/template';

describe('QuantitySelector', () => {
  let productMock: Product;

  beforeAll(() => productMock = mockProduct());

  afterAll(() => deleteMockProduct(productMock.id));

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
    return queryBtn('-');
  }

  async function decrementQuantity(): Promise<void> {
    await mockUserEvent().click(getDecrementBtn());
  }

  function getQuantity(): HTMLElement {
    return getStatus();
  }

  function getIncrementBtn(): HTMLElement {
    return queryBtn('+')
  }

  async function incrementQuantity(): Promise<void> {
    await mockUserEvent().click(getIncrementBtn());
  }

  function validateAddBtnInDocument(): void {
    expect(queryBtn(/add/i)).toBeInTheDocument();
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