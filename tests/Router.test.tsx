import { render, screen } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import routes from '../src/routes';

import { deleteMockProduct, mockProduct } from './helpers/data';
import { getHeading } from './helpers/template';

describe('Router', () => {
  function mockNavigation(path?: string) {
    const router = createMemoryRouter(routes, {
      initialEntries: [`/${path || ''}`]
    });

    render(<RouterProvider router={router} />);
  }

  async function findHeading(name: RegExp | string): Promise<HTMLElement> {
    return screen.findByRole('heading', { name });
  }

  describe('should render <x> page for <y> route', () => {
    it('<home>, </>', () => {
      mockNavigation();

      expect(getHeading(/home/i)).toBeInTheDocument()
    });

    it('<products>, </products>', () => {
      mockNavigation('products');

      expect(getHeading(/products/i)).toBeInTheDocument()
    });
  });

  it('should render product details page', async () => {
    const product = mockProduct();

    mockNavigation(`products/${product.id}`);

    expect(await findHeading(product.name)).toBeInTheDocument();

    deleteMockProduct(product.id);
  });

  it('should render error page for invalid route', async () => {
    mockNavigation('asdf');

    expect(await findHeading(/oops/i)).toBeInTheDocument();
  });
});