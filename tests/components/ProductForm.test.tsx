import { render, screen } from '@testing-library/react';

import ProductForm from '../../src/components/ProductForm';
import { Category, Product } from '../../src/entities';

import AllProviders from '../AllProviders';
import { db } from '../mocks/db';
import { mockUserEvent, openCombobox, queryBtn } from '../shared/helpers';

describe('ProductForm', () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
    const { id: categoryId } = category;

    product = db.product.create({ categoryId });
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  async function renderComponent(product?: Product): Promise<void> {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await screen.findByRole('form');
  }

  function getNameInput(): HTMLElement {
    return screen.getByPlaceholderText(/name/i);
  }

  function getPriceInput(): HTMLElement {
    return screen.getByPlaceholderText(/price/i);
  }

  function getCategoriesDropdown(): HTMLElement {
    return screen.getByRole('combobox', { name: /category/i });
  }

  it('should render inputs', async () => {
    await renderComponent();

    expect(getNameInput()).toBeInTheDocument();
    expect(getPriceInput()).toBeInTheDocument();
    expect(getCategoriesDropdown()).toBeInTheDocument();
  });

  it('should focus first input', async () => {
    await renderComponent();

    expect(getNameInput()).toHaveFocus();
  });

  it('should pre-fill inputs when product being edited', async () => {
    await renderComponent(product);

    expect(getNameInput()).toHaveValue(product.name);
    expect(getPriceInput()).toHaveValue(`${product.price}`);
    expect(getCategoriesDropdown()).toHaveTextContent(category.name);
  });

  describe('--- validation-related ---', () => {
    type FormData = { [K in keyof Partial<Product>]: string }

    async function fillOutAndSubmitForm({ name, price }: FormData): Promise<void> {
      await renderComponent();

      const userEvent = mockUserEvent();

      name && await userEvent.type(getNameInput(), name);
      price && await userEvent.type(getPriceInput(), price);

      await userEvent.tab();
      await openCombobox();

      const options = screen.getAllByRole('option');

      await userEvent.click(options.at(0)!);

      await userEvent.click(queryBtn());
    }

    function validateDisplayOfError(error: RegExp): void {
      expect(screen.getByRole('alert')).toHaveTextContent(error);
    }

    it.each([
      {
        scenario: 'is missing',
        error: /name|required/i,
      },
      {
        scenario: 'exceeds max length',
        name: 'a'.repeat(256),
        error: /name|character\(s\)/i,
      }
    ])('should render an error if name $scenario', async ({ name, error }) => {
      await fillOutAndSubmitForm({ name, price: '10' });

      validateDisplayOfError(error);
    });

    it.each([
      {
        scenario: 'is missing',
        error: /price|required/i,
      },
      {
        scenario: 'is not a number',
        error: /price|required/i,
      },
      {
        scenario: 'is 0',
        price: '0',
        error: /greater|equal|1/i,
      },
      {
        scenario: 'is negative',
        price: '-1',
        error: /greater|equal|1/i,
      },
      {
        scenario: 'exceeds 1000',
        price: '1001',
        error: /less than|equal|1000/i,
      }
    ])('should render an error if price $scenario', async ({ price, error }) => {
      await fillOutAndSubmitForm({ name: 'a', price });

      validateDisplayOfError(error);
    });
  });
});