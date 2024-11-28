import { render, waitForElementToBeRemoved } from '@testing-library/react';

import noop from 'lodash/noop';
import { http, HttpResponse } from 'msw';

import ProductDetail from '../../src/components/ProductDetail';

import AllProviders from '../AllProviders';
import { mockApiDelay, mockApiError } from '../helpers/api';
import { deleteMockProduct, mockProduct } from '../helpers/data';
import { findByText, queryByText } from '../helpers/template';
import { db } from '../mock-server/db';
import { server } from '../mock-server';

describe('ProductDetail', () => {
  let productId: number;
  let endpoint: `products/${number}`;

  beforeAll(() => {
    productId = mockProduct().id;

    endpoint = `products/${productId}`;
  });

  afterAll(() => deleteMockProduct(productId));

  function renderComponent({ id = productId } = {}): void {
    render(<ProductDetail productId={id} />, { wrapper: AllProviders });
  }

  describe('should render <x>', () => {
    it('<loading indicator>', async () => {
      mockApiDelay('products');

      renderComponent();

      expect(await findByText('loading')).toBeInTheDocument();
    });

    it('<product details>', async () => {
      const product = db.product.findFirst({ where: { id: { equals: productId } } });

      renderComponent();

      expect(await findByText(product!.name)).toBeInTheDocument();
      expect(await findByText(`\\$${product!.price}`)).toBeInTheDocument();
    });

    it(`<messaging when product doesn't exist>`, async () => {
      server.use(http.get(endpoint, () => HttpResponse.json(null)))

      renderComponent();

      expect(await findByText('not found')).toBeInTheDocument();
    });

    it(`<error> when API call fails`, async () => {
      mockApiError(endpoint);

      renderComponent();

      expect(await findByText('error')).toBeInTheDocument();
    });
  });

  describe('should not render loading indicator after <x>', () => {
    afterEach(async () => {
      renderComponent();

      await waitForElementToBeRemoved(() => queryByText(/loading/i));
    });

    it('<data loaded>', () => {
      noop();
    });

    it('<API call failed>', () => {
      mockApiError('products');
    });
  });
});