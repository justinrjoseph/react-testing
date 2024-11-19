import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';

import { Mock } from 'vitest';

import OrderStatusSelector from '../../src/components/OrderStatusSelector';

import { mockUserEvent } from '../shared/helpers';

describe('OrderStatusSelector', () => {
  let onChangeMock:Mock;

  describe('should render <x>', () => {
    function getCombobox(): HTMLElement {
      return screen.getByRole('combobox');
    }

    async function openCombobox(): Promise<void> {
      await mockUserEvent().click(getCombobox());
    }

    beforeEach(() => {
      onChangeMock = vi.fn();

      render(
        <Theme>
          <OrderStatusSelector onChange={onChangeMock} />
        </Theme>
      );
    });

    it('<New as the default value>', () => {
      expect(getCombobox()).toHaveTextContent(/new/i);
    });

    it('<correct statuses>', async () => {
      await openCombobox();

      const options = await screen.findAllByRole('option');

      const labels = options.map((item) => item.textContent);

      expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
    });

    describe('should report selection of <x>', () => {
      beforeEach(async () => await openCombobox());

      async function getOption(value: string): Promise<HTMLElement> {
        return await screen.findByRole('option', {
          name: new RegExp(value, 'i')
        });
      }

      it('<new>', async () => {
        const processed = await getOption('processed');
        await mockUserEvent().click(processed);

        await openCombobox();

        const newOption = await getOption('new');
        await mockUserEvent().click(newOption);

        expect(onChangeMock).toHaveBeenCalledWith('new');
      });

      it.each(['processed', 'fulfilled'])('<$value>', async (value) => {
        const option = await getOption(value);

        await mockUserEvent().click(option);

        expect(onChangeMock).toHaveBeenCalledWith(value);
      });
    });
  });
});