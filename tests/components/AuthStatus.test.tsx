import { render } from '@testing-library/react';

import AuthStatus from '../../src/components/AuthStatus';

import { mockUser } from '../helpers/data';
import { AuthStatus as AuthStatusModel } from '../helpers/model';
import { getByText, mockAuthStatus, queryBtn} from '../helpers/template';

describe('AuthStatus', () => {
  describe('should render', () => {
    function queryLoginBtn(): HTMLElement {
      return queryBtn(/log in/i);
    }

    function queryLogoutBtn(): HTMLElement {
      return queryBtn(/log out/i);
    }

    it('loading state', () => {
      mockAuthStatus({ isLoading: true } as AuthStatusModel);

      render(<AuthStatus />);

      expect(getByText(/loading/i)).toBeInTheDocument();

      expect(queryLogoutBtn()).not.toBeInTheDocument();
    });

    it('button for logging in', () => {
      mockAuthStatus({ isAuthenticated: false } as AuthStatusModel);

      render(<AuthStatus />);

      expect(queryLoginBtn()).toBeInTheDocument();
    });

    it('user name and button for logging out', () => {
      const user = mockUser();

      mockAuthStatus({ user, isAuthenticated: true } as AuthStatusModel);

      render(<AuthStatus />);

      expect(getByText(user.name)).toBeInTheDocument()
      expect(queryLogoutBtn()).toBeInTheDocument();

      expect(queryLoginBtn()).not.toBeInTheDocument();
    });
  });
});