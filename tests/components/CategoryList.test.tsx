import { render, waitForElementToBeRemoved } from '@testing-library/react';

import { Category } from '../../src/entities';
import CategoryList from '../../src/components/CategoryList';

import AllProviders from '../AllProviders';
import { mockApiDelay, mockApiError } from '../helpers/api';
import {mockCategory, deleteMockCategories} from '../helpers/data';
import { findByText, getByText } from '../helpers/template';

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

      [1, 2, 3].forEach(() => categories = [mockCategory(), ...categories]);

      renderComponent();

      await waitForElementToBeRemoved(() => getByText(/loading/i));

      categories.forEach(({ name }) => expect(getByText(name)).toBeInTheDocument());

      deleteMockCategories(categories.map(({ id }) => id));
    });

    it('error', async () => {
      mockApiError('categories');

      renderComponent();

      expect(await findByText('error')).toBeInTheDocument();
    });
  });
});