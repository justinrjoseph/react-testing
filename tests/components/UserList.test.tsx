import { render, screen } from '@testing-library/react';

import UserList from '../../src/components/UserList';
import { User } from '../../src/entities';

describe('UserList', () => {
  describe('should render <x>', () => {
    it('<messaging when no users>', () => {
      render(<UserList users={[]} />);

      expect(screen.getByText(/no users/i)).toBeInTheDocument();
    });

    it('<list of users>', () => {
      const users: User[] = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' }
      ];

      render(<UserList users={users} />);

      users.forEach((user) => {
        const el = screen.getByRole('link', { name: user.name });

        expect(el).toHaveTextContent(user.name);
        expect(el).toHaveAttribute('href', `/users/${user.id}`)
      });
    });
  });
});