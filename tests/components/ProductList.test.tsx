import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import noop from 'lodash/noop';
import { http, HttpResponse, delay } from 'msw';

import ProductList from '../../src/components/ProductList';

import { db } from '../mocks/db';
import { server } from '../mocks/server';
import { findByText, mockApiError } from '../shared/helpers';

describe('ProductList', () => {
  let productIds: number[] = [];
  const endpoint = '/products';

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();

      productIds = [product.id, ...productIds];
    });
  });

  afterAll(() => db.product.deleteMany({ where: { id: { in: productIds } } }));

  describe('should render <x>', () => {
    it('<loading indicator>', async () => {
      server.use(http.get(endpoint, async () => {
        await delay();
        return HttpResponse.json([]);
      }));

      render(<ProductList />);

      expect(await findByText('loading')).toBeInTheDocument();
    });

    it('<list of products>', async () => {
      render(<ProductList />);

      const items = await screen.findAllByRole('listitem');

      expect(items.length).toBeGreaterThan(0);
    });

    it('<messaging when no products available>', async () => {
      server.use(http.get(endpoint, () => HttpResponse.json([])));

      render(<ProductList />);

      expect(await findByText('no products')).toBeInTheDocument();
    });

    it(`<error> when API call fails`, async () => {
      mockApiError(endpoint);

      render(<ProductList />);

      expect(await findByText('error')).toBeInTheDocument();
    });
  });

  describe('should not render loading indicator after <x>', () => {
    afterEach(async () => {
      render(<ProductList />);

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