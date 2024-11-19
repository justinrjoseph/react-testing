import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';

import OrderStatusSelector from '../../src/components/OrderStatusSelector';

import { mockUserEvent } from '../shared/helpers';

describe('OrderStatusSelector', () => {
  describe('should render <x>', () => {
    function getCombobox():HTMLElement {
      return screen.getByRole('combobox') as HTMLElement;
    }

    beforeEach(() => {
      render(
        <Theme>
          <OrderStatusSelector onChange={vi.fn()} />
        </Theme>
      );
    });

    it('<New as the default value>', () => {
      expect(getCombobox()).toHaveTextContent(/new/i);
    });

    it('<correct statuses>', async () => {
      await mockUserEvent().click(getCombobox());

      const options = await screen.findAllByRole('option');

      const labels = options.map((item) => item.textContent);

      expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
    });
  });
});