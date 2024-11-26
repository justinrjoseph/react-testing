import { render, screen } from '@testing-library/react';

import ProductForm from '../../src/components/ProductForm';
import { Product } from '../../src/entities';

import AllProviders from '../AllProviders';
import { db } from '../mocks/db';

describe('ProductForm', () => {
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

  it('should pre-fill inputs when product being edited', async () => {
    const category = db.category.create();
    const { id: categoryId } = category;

    const product = db.product.create({ categoryId, category });

    await renderComponent(product);

    expect(getNameInput()).toHaveValue(product.name);
    expect(getPriceInput()).toHaveValue(`${product.price}`);
    expect(getCategoriesDropdown()).toHaveTextContent(category.name);

    db.category.delete({ where: { id: { equals: category.id } } });
    db.product.delete({ where: { id: { equals: product.id } } });
  });
});