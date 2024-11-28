import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import noop from 'lodash/noop';

import ProductList from '../../src/components/ProductList';

import AllProviders from '../AllProviders';
import { createProduct, deleteProducts, findByText, mockApiDelay, mockApiError, mockEmptyResponse } from '../shared/helpers';

describe('ProductList', () => {
  let productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      productIds = [createProduct().id, ...productIds];
    });
  });

  afterAll(() => deleteProducts(productIds));

  function renderComponent(): void {
    render(<ProductList />, { wrapper: AllProviders })
  }

  describe('should render <x>', () => {
    it('<loading indicator>', async () => {
      mockApiDelay('products');

      renderComponent();

      expect(await findByText('loading')).toBeInTheDocument();
    });

    it('<list of products>', async () => {
      renderComponent();

      const items = await screen.findAllByRole('listitem');

      expect(items.length).toBeGreaterThan(0);
    });

    it('<messaging when no products available>', async () => {
      mockEmptyResponse('products');

      renderComponent();

      expect(await findByText('no products')).toBeInTheDocument();
    });

    it(`<error> when API call fails`, async () => {
      mockApiError('products');

      renderComponent();

      expect(await findByText('error')).toBeInTheDocument();
    });
  });

  describe('should not render loading indicator after <x>', () => {
    afterEach(async () => {
      renderComponent();

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    });

    it('<data loaded>', () => {
      noop();
    });

    it('<API call failed>', () => {
      mockApiError('products');
    });
  });
});