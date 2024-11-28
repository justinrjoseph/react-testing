import { useAuth0 } from '@auth0/auth0-react';
import { screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { AuthStatus } from './model';

export function mockAuthStatus(state: AuthStatus): void {
  vi.mocked(useAuth0).mockReturnValue({
    ...state,
    getAccessTokenSilently: vi.fn(),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn()
  });
}

export function getHeading(): HTMLHeadingElement {
  return screen.getByRole('heading');
}

export function getByPlaceholderText(content: RegExp): HTMLElement {
  return screen.getByPlaceholderText(content);
}

export function getByText(content: RegExp | string): HTMLElement {
  return screen.getByText(content);
}

export function getStatus(): HTMLElement {
  return screen.getByRole('status');
}

export function queryByText(content: RegExp): HTMLElement | null {
  return screen.queryByText(content);
}

export function queryBtn(name?: RegExp | string): HTMLButtonElement {
  return screen.queryByRole('button', name ? { name } : {}) as HTMLButtonElement;
}

export function findByText(content: string): Promise<HTMLElement> {
  return screen.findByText(new RegExp(content, 'i'));
}

export function findListItems(): Promise<HTMLElement[]> {
  return screen.findAllByRole('listitem');
}

export function findOptions(): Promise<HTMLElement[]> {
  return screen.findAllByRole('option');
}

export function queryCombobox(): HTMLElement | null {
  return screen.queryByRole('combobox');
}

export async function openCombobox(): Promise<void> {
  await mockUserEvent().click(queryCombobox()!);
}

export function mockUserEvent(): UserEvent {
  return userEvent.setup();
}