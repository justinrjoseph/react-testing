import { render, screen } from '@testing-library/react';

import Greet from '../../src/components/Greet';

describe('Greet', () => {
  describe('should render <x>', () => {
    it('<message>', () => {
      const name = 'Justin';

      render(<Greet name={name} />);

      const el = screen.getByRole('heading');

      expect(el).toHaveTextContent(new RegExp(name, 'i'));
    });

    it('<login button>', () => {
      render(<Greet />);

      const el = screen.getByRole('button');

      expect(el).toHaveTextContent(/login/i);
    });
  });
});