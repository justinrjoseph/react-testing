import { render, screen } from '@testing-library/react';

import TermsAndConditions from '../../src/components/TermsAndConditions';

import { getHeading, mockUserEvent, queryBtn } from '../shared/helpers';

describe('TermsAndConditions', () => {
  beforeEach(() => render(<TermsAndConditions />));

  function queryCheckbox(): HTMLInputElement {
    return screen.getByRole('checkbox') as HTMLInputElement;
  }

  it('should render with heading and initial state', () => {
    expect(getHeading()).toHaveTextContent('Terms & Conditions');

    expect(queryCheckbox()).not.toBeChecked();

    expect(queryBtn()).toBeDisabled();
  });

  it('should enable the button when the checkbox is checked', async () => {
    await mockUserEvent().click(queryCheckbox());

    expect(queryBtn()).toBeEnabled();
  });
});