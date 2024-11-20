import { render, screen } from '@testing-library/react';

import { http, HttpResponse } from 'msw';

import ProductList from '../../src/components/ProductList';

import { server } from '../mocks/server';
import { findByText } from '../shared/helpers';

describe('ProductList', () => {
  describe('should render <x>', () => {
    it('<list of products>', async () => {
      render(<ProductList />);

      const items = await screen.findAllByRole('listitem');

      expect(items.length).toBeGreaterThan(0);
    });

    it('<messaging when no products available>', async () => {
      server.use(http.get('/products', () => HttpResponse.json([])));

      render(<ProductList />);

      expect(await findByText('no products')).toBeInTheDocument();
    });
  });
});