import { render, screen } from '@testing-library/react';

import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

import { queryBtn } from '../shared/helpers';

describe('UserAccount', () => {
  function mockUser({ isAdmin = false } = {}):User {
    return { name: 'Justin', isAdmin } as User;
  }

  function queryEditBtn():HTMLButtonElement {
    return queryBtn() as HTMLButtonElement;
  }

  describe('should render <x>', () => {
    it(`<user's name>`, () => {
      const user = mockUser();

      render(<UserAccount user={user} />);

      const el = screen.getByText(user.name);

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