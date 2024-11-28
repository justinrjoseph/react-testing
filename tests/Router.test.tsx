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

    it('<product details>, </<id>>', async () => {
      const product = mockProduct();

      mockNavigation(`products/${product.id}`);

      expect(await findHeading(product.name)).toBeInTheDocument();

      deleteMockProduct(product.id);
    });

    it('<error>, <invalid>', async () => {
      mockNavigation('asdf');

      expect(await findHeading(/oops/i)).toBeInTheDocument();
    });

    describe('--- admin-related ---', () => {
      function mockAdminProductsNavigation(path?: string): void {
        mockNavigation(`admin/products/${path || ''}`);
      }

      it('<admin>, </admin>', () => {
        mockNavigation('admin');

        expect(getHeading(/admin/i)).toBeInTheDocument();
      });

      it('<admin products>, </admin/products>', () => {
        mockAdminProductsNavigation();

        expect(getHeading(/products/i)).toBeInTheDocument();
      });

      it('<new product>, </admin/products/new>', () => {
        mockAdminProductsNavigation('new');

        expect(getHeading(/new product/i)).toBeInTheDocument();
      });

      it('<edit product>, </admin/products/edit>', async () => {
        const product = mockProduct();

        mockAdminProductsNavigation(`${product.id}/edit`);

        expect(await findHeading(/edit product/i)).toBeInTheDocument();

        deleteMockProduct(product.id);
      });
    });
  });
});