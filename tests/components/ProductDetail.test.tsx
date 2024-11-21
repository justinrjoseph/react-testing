import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import noop from 'lodash/noop';
import { delay, http, HttpResponse } from 'msw';

import ProductDetail from '../../src/components/ProductDetail';

import AllProviders from '../AllProviders';
import { db } from '../mocks/db';
import { server } from '../mocks/server';
import { findByText, mockApiError } from '../shared/helpers';

describe('ProductDetail', () => {
  let productId: number;
  let endpoint: `/products/${number}`;

  beforeAll(() => {
    productId = db.product.create().id;

    endpoint = `/products/${productId}`;
  });

  afterAll(() => db.product.delete({ where: { id: { equals: productId } } }))

  function renderComponent({ id = productId } = {}): void {
    render(<ProductDetail productId={id} />, { wrapper: AllProviders });
  }

  describe('should render <x>', () => {
    it('<loading indicator>', async () => {
      server.use(http.get(endpoint, async () => {
        await delay();
        return HttpResponse.json([])
      }));

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

      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    });

    it('<data loaded>', () => {
      noop();
    });

    it('<API call failed>', () => {
      mockApiError(endpoint);
    });
  });
});