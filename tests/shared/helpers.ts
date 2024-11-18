import { screen } from '@testing-library/react';
import userEvent, {UserEvent} from '@testing-library/user-event';

export function queryBtn():HTMLButtonElement {
  return screen.queryByRole('button') as HTMLButtonElement;
}

export function mockUserEvent():UserEvent {
  return userEvent.setup();
}