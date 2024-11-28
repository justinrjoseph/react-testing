import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import { Category } from '../../src/entities';
import CategoryList from '../../src/components/CategoryList';

import AllProviders from '../AllProviders';
import { createCategory, deleteCategories, findByText, mockApiDelay, mockApiError } from '../shared/helpers';

describe('CategoryList', () => {
  function renderComponent(): void {
    render(<CategoryList /> , { wrapper: AllProviders });
  }

  describe('should render', () => {
    it('loading message', async () => {
      mockApiDelay('categories');

      renderComponent();

      expect(await findByText('loading')).toBeInTheDocument();
    });

    it('categories', async () => {
      let categories: Category[] = [];

      [1, 2, 3].forEach(() => categories = [createCategory(), ...categories]);

      renderComponent();

      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

      categories.forEach(({ name }) => expect(screen.getByText(name)).toBeInTheDocument());

      deleteCategories(categories.map(({ id }) => id));
    });

    it('error', async () => {
      mockApiError('categories');

      renderComponent();

      expect(await findByText('error')).toBeInTheDocument();
    });
  });
});