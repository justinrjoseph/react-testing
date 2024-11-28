import { render } from '@testing-library/react';

import Greet from '../../src/components/Greet';

import { getHeading, queryBtn } from '../helpers/template';

describe('Greet', () => {
  describe('should render <x>', () => {
    it('<message>', () => {
      const name = 'Justin';

      render(<Greet name={name} />);

      expect(getHeading()).toHaveTextContent(new RegExp(name, 'i'));
    });

    it('<login button>', () => {
      render(<Greet />);

      expect(queryBtn()).toHaveTextContent(/login/i);
    });
  });
});