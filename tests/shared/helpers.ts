import { screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

export function getHeading(): HTMLHeadingElement {
  return screen.getByRole('heading');
}

export function queryBtn(): HTMLButtonElement {
  return screen.queryByRole('button') as HTMLButtonElement;
}

export function findByText(content: string): Promise<HTMLElement> {
  return screen.findByText(new RegExp(content, 'i'));
}

export function mockUserEvent(): UserEvent {
  return userEvent.setup();
}