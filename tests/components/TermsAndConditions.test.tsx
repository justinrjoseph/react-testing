import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TermsAndConditions from '../../src/components/TermsAndConditions';

describe('TermsAndConditions', () => {
  beforeEach(() => render(<TermsAndConditions />));

  function queryCheckbox():HTMLInputElement {
    return screen.getByRole('checkbox') as HTMLInputElement;
  }

  function queryBtn():HTMLButtonElement {
    return screen.getByRole('button') as HTMLButtonElement;
  }

  it('should render with heading and initial state', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('Terms & Conditions');

    expect(queryCheckbox()).not.toBeChecked();

    expect(queryBtn()).toBeDisabled();
  });

  it('should enable the button when the checkbox is checked', async () => {
    const user = userEvent.setup();

    await user.click(queryCheckbox());

    expect(queryBtn()).toBeEnabled();
  });
});