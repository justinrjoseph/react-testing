import { screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { http, HttpResponse } from 'msw';

import { server } from '../mocks/server';

export function getHeading(): HTMLHeadingElement {
  return screen.getByRole('heading');
}

export function queryBtn(): HTMLButtonElement {
  return screen.queryByRole('button') as HTMLButtonElement;
}

export function findByText(content: string): Promise<HTMLElement> {
  return screen.findByText(new RegExp(content, 'i'));
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

export function mockEmptyResponse(endpoint: string): void {
  server.use(http.get(endpoint, () => HttpResponse.json([])));
}

export function mockApiError(endpoint: string):void {
  server.use(http.get(endpoint, () => HttpResponse.error()))
}