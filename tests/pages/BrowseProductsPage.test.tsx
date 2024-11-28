import { faker } from '@faker-js/faker';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import { Category, Product } from '../../src/entities';
import BrowseProducts from '../../src/pages/BrowseProductsPage';

import AllProviders from '../AllProviders';
import { db } from '../mocks/db';
import { createCategory, deleteCategories, deleteProducts, mockApiDelay, mockApiError,
  mockEmptyResponse, mockUserEvent, openCombobox, queryCombobox } from '../shared/helpers';

describe('BrowseProductsPage', () => {
  let categories: Category[] = [];
  let products: Product[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const category = createCategory();
      const duplicateCategory = categories.find((item) => item.name === category.name);

      if (duplicateCategory) {
        const updatedCategory = db.category.update({
          where: { id: { equals: category.id } },
          data: { name: () => faker.commerce.department() }
        });
        categories = [...categories, updatedCategory!];
      }
      else {
        categories = [...categories, category];
      }

      [1, 2].forEach(() => {
        const product = db.product.create({ categoryId: category.id });
        products = [...products, product];
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map(({ id }) => id);
    deleteCategories(categoryIds);

    const productIds = products.map(({ id }) => id);
    deleteProducts(productIds);
  });

  function renderComponent(): void {
    render(<BrowseProducts />, { wrapper: AllProviders });
  }

  function queryCategoriesSkeleton(): HTMLElement | null {
    return screen.queryByRole('progressbar', { name: /categories/i })
  }

  function queryProductsSkeleton(): HTMLElement | null {
    return screen.queryByRole('progressbar', { name: /products/i })
  }

  describe('should render <x>', () => {
    describe('<loading skeletons> for <y>', () => {
      function getProgressBar(target: 'categories' | 'products'): HTMLElement {
        return screen.getByRole('progressbar', { name: new RegExp(target, 'i') });
      }

      it('<categories>', () => {
        mockApiDelay('categories');

        renderComponent();

        expect(getProgressBar('categories')).toBeInTheDocument();
      });

      it('<products>', () => {
        mockApiDelay('products');

        renderComponent();

        expect(getProgressBar('products')).toBeInTheDocument();
      });
    });

    it('<categories>', async () => {
      renderComponent();

      await waitForElementToBeRemoved(queryCategoriesSkeleton);

      await openCombobox();

      const options = await screen.findAllByRole('option');

      const labels = options.map((item) => item.textContent);

      expect(labels).toEqual(['All', ...categories.map(({ name }) => name)]);
    });

    it('<products>', async () => {
      renderComponent();

      await waitForElementToBeRemoved(() => queryProductsSkeleton());

      products.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
        expect(screen.getAllByText(new RegExp(item.price.toString())).length)
        .toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('should not render loading skeletons after <x>', () => {
    describe('<y> loaded', () => {
      beforeEach(() => {
        mockEmptyResponse('categories');

        renderComponent();
      });

      it('<categories>', async () => {
        await waitForElementToBeRemoved(queryCategoriesSkeleton);
      });

      it('<products>', async () => {
        await waitForElementToBeRemoved(queryProductsSkeleton);
      });
    });

    it('<API calls failed>', () => {
      mockApiError('categories');
      mockApiError('products');

      expect(queryCategoriesSkeleton()).not.toBeInTheDocument();
      expect(queryProductsSkeleton()).not.toBeInTheDocument();
    });
  });

  it('should not render error if request for categories fails', async () => {
    mockApiError('categories');

    renderComponent();

    await waitForElementToBeRemoved(queryCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(queryCombobox()).not.toBeInTheDocument();
  });

  it('should render error if request for products fails', async () => {
    mockEmptyResponse('categories');
    mockApiError('products');

    renderComponent();

    await waitForElementToBeRemoved(queryProductsSkeleton);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  describe('--- filter-related', () => {
    async function selectCategory(label: string): Promise<void> {
      await openCombobox();

      const option = screen.getByRole('option', { name: new RegExp(label, 'i') });
      await mockUserEvent().click(option);
    }

    function validateProductsInDocument(items: Product[]): void {
      const dataRows = screen.getAllByRole('row').slice(1);

      expect(dataRows.length).toBe(items.length);

      items.forEach(({ name }) => expect(screen.queryByText(name)).toBeInTheDocument());
    }

    beforeEach(async () => {
      const [{ name }] = categories;

      renderComponent();

      await waitForElementToBeRemoved(queryProductsSkeleton);

      await selectCategory(name);
    });

    it('should filter products by category', () => {
      const [{ id }] = categories;

      validateProductsInDocument(db.product.findMany({
        where: { categoryId: { equals: id } }
      }));
    });

    it('should re-render all products', async () => {
      await selectCategory('all');

      validateProductsInDocument(products);
    });
  });
});
