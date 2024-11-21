import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import noop from 'lodash/noop';
import { delay, http, HttpResponse } from 'msw';

import ProductDetail from '../../src/components/ProductDetail';

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

  describe('should render <x>', () => {
    it('<loading indicator>', async () => {
      server.use(http.get(endpoint, async () => {
        await delay();
        return HttpResponse.json([])
      }));

      render(<ProductDetail productId={productId} />);

      expect(await findByText('loading')).toBeInTheDocument();
    });

    it('<product details>', async () => {
      const product = db.product.findFirst({ where: { id: { equals: productId } } });

      render(<ProductDetail productId={productId} />);

      expect(await findByText(product!.name)).toBeInTheDocument();
      expect(await findByText(`\\$${product!.price}`)).toBeInTheDocument();
    });

    it(`<messaging when product doesn't exist>`, async () => {
      server.use(http.get(endpoint, () => HttpResponse.json(null)))

      render(<ProductDetail productId={productId}/>);

      expect(await findByText('not found')).toBeInTheDocument();
    });

    describe(`<error>`, () => {
      it('when productId invalid', async () => {
        render(<ProductDetail productId={0}/>);

        expect(await findByText('invalid')).toBeInTheDocument();
      });

      it('when API call fails', async () => {
        mockApiError(endpoint);

        render(<ProductDetail productId={productId} />);

        expect(await findByText('error')).toBeInTheDocument();
      });
    });
  });

  describe('should not render loading indicator after', () => {
    afterEach(async () => {
      render(<ProductDetail productId={productId} />);

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