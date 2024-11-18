import { render, screen } from '@testing-library/react'

import SearchBox from '../../src/components/SearchBox';

import { Mock } from 'vitest';
import {mockUserEvent} from '../shared/helpers';

describe('SearchBox', () => {
  let onChangeMock:Mock;

  function getInput():HTMLInputElement {
    return screen.getByPlaceholderText(/search/i) as HTMLInputElement;
  }

  beforeEach(() => {
    onChangeMock = vi.fn();

    render(<SearchBox onChange={onChangeMock} />);
  })

  it('should render input with placeholder', () => {
    expect(getInput()).toBeInTheDocument();
  });

  describe('should <x> search term', () => {
    const term = 'search';

    async function mockInput({ content = term } = {}):Promise<void> {
      await mockUserEvent().type(getInput(), `${content}{enter}`);
    }

    it('<update>', async () => {
      await mockInput();

      expect(onChangeMock).toHaveBeenCalledWith(term);
    });

    it('<not update>', async () => {
      await mockInput({ content: '' });

      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });
});