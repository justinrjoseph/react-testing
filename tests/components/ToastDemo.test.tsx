import { render, screen } from '@testing-library/react'

import { Toaster } from 'react-hot-toast';

import ToastDemo from '../../src/components/ToastDemo';

import { mockUserEvent, queryBtn } from '../shared/helpers';

describe('ToastDemo', () => {
  it('should render toast notification', async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    await mockUserEvent().click(queryBtn());

    const toast = await screen.getByRole('status');

    expect(toast).toBeInTheDocument();
  });
});