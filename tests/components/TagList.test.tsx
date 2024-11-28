import { render } from '@testing-library/react'

import TagList from '../../src/components/TagList';

import { findListItems } from '../helpers/template';

describe('TagList', () => {
  it('should render tags', async () => {
    render(<TagList />);

    const listItems = await findListItems();

    expect(listItems.length).toBeGreaterThan(0);
  });
});