import { render } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import routes from '../../src/routes';

export function mockNavigation(path?: string) {
  const router = createMemoryRouter(routes, {
    initialEntries: [`/${path || ''}`]
  });

  render(<RouterProvider router={router} />);
}