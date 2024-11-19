import { render, screen } from '@testing-library/react';

import noop from 'lodash/noop';

import ExpandableText from '../../src/components/ExpandableText';

import { mockUserEvent as mockAppUser, queryBtn } from '../shared/helpers';

describe('ExpandableText', () => {
  const limit = 255;

  function mockText(numOfChars = limit): string {
    return 'a'.repeat(numOfChars);
  }

  describe('should render', () => {
    it('<full text>', () => {
      const text = mockText();

      render(<ExpandableText text={text} />)

      expect(screen.getByText(text)).toBeInTheDocument();
      expect(queryBtn()).not.toBeInTheDocument();
    });

    describe('--- collapsed/expanded-related', () => {
      const text = mockText(256);

      beforeEach(() => render(<ExpandableText text={text} />));

      describe('<truncated text>', () => {
        afterEach(() => {
          expect(screen.getByText(`${text.substring(0, limit)}...`))
            .toBeInTheDocument();

          expect(queryBtn()).toHaveTextContent(/more/i);
        });

        it('upfront', () => {
          noop();
        });

        it('when user decides to show less', async () => {
          const button = queryBtn();

          await mockAppUser().click(button);
          await mockAppUser().click(button);
        });
      });

      it('<expanded text>', async () => {
        const button = queryBtn();

        await mockAppUser().click(button);

        expect(screen.getByText(text));
        expect(screen.getByRole('article')).not.toHaveTextContent('...');

        expect(button).toHaveTextContent(/less/i);
      });
    });
  });
});