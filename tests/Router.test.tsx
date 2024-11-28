import { render } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import routes from '../src/routes';

import { getHeading } from './helpers/template';

describe('Router', () => {
  function mockNavigation(path: string) {
    const router = createMemoryRouter(routes, {
      initialEntries: [path]
    });

    render(<RouterProvider router={router} />);
  }

  describe('should render <x> page for <y> route', () => {
    it('<home>, </>', () => {
      mockNavigation('/');

      expect(getHeading(/home/i)).toBeInTheDocument()
    });

    it('<products>, </products>', () => {
      mockNavigation('/products');

      expect(getHeading(/products/i)).toBeInTheDocument()
    });
  });
});