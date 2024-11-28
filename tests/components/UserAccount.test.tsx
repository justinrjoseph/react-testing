import { render } from '@testing-library/react';

import UserAccount from '../../src/components/UserAccount';

import { mockUser } from '../helpers/data';
import { getByText, queryBtn } from '../helpers/template';

describe('UserAccount', () => {
  function queryEditBtn(): HTMLButtonElement {
    return queryBtn();
  }

  describe('should render <x>', () => {
    it(`<user's name>`, () => {
      const user = mockUser();

      render(<UserAccount user={user} />);

      const el = getByText(user.name);

      expect(el).toBeInTheDocument();
    });

    it('<Edit button for admin users>', () => {
      render(<UserAccount user={mockUser({ isAdmin: true })} />)

      expect(queryEditBtn()).toHaveTextContent(/edit/i);
    });
  });

  it('should not render Edit button for non-admin users', () => {
    render(<UserAccount user={mockUser()} />)

    expect(queryEditBtn()).not.toBeInTheDocument();
  });
});