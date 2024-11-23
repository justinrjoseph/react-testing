import { Theme } from '@radix-ui/themes';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import { delay, http, HttpResponse, JsonBodyType, StrictResponse } from 'msw';

import BrowseProducts from '../../src/pages/BrowseProductsPage';

import { server } from '../mocks/server';
import { mockApiError } from '../shared/helpers';

describe('BrowseProductsPage', () => {
  function renderComponent():void {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
  }

  describe('should render <x>', () => {
    describe('<loading skeletons> for <y>', () => {
      const delayedResponse = async (): Promise<StrictResponse<JsonBodyType>> => {
        await delay();
        return HttpResponse.json([]);
      }

      it('<categories>', () => {
        server.use(http.get('/categories', async () => delayedResponse()));

        renderComponent();

        expect(screen.getByRole('progressbar', { name: /categories/i })).toBeInTheDocument();
      });

      it.skip('<products>', () => {
        server.use(http.get('/products', async () => delayedResponse()));

        renderComponent();

        expect(screen.getByRole('progressbar', { name: /products/i })).toBeInTheDocument();
      });
    });
  });

  describe('should not render loading skeletons after <x>', () => {
    function queryCategoriesSkeleton():HTMLElement | null {
      return screen.queryByRole('progressbar', { name: /categories/i })
    }

    function queryProductsSkeleton():HTMLElement | null {
      return screen.queryByRole('progressbar', { name: /products/i })
    }

    describe('<y> loaded', () => {
      beforeEach(() => {
        server.use(http.get('/categories', () => HttpResponse.json([])));

        renderComponent();
      });

      it('<categories>', async () => {
        await waitForElementToBeRemoved(() => queryCategoriesSkeleton());
      });

      it('<products>', async () => {
        await waitForElementToBeRemoved(() => queryProductsSkeleton());
      });
    });

    it('<API calls failed>', () => {
      mockApiError('/categories');
      mockApiError('/products');

      expect(queryCategoriesSkeleton()).not.toBeInTheDocument();
      expect(queryProductsSkeleton()).not.toBeInTheDocument();
    });
  });
});
