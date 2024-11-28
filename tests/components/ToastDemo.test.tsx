import { render, screen } from '@testing-library/react';

import { Toaster } from 'react-hot-toast';

import ToastDemo from '../../src/components/ToastDemo';

import {mockUserEvent, queryBtn} from '../helpers/template';

describe('ToastDemo', () => {
  it('should render toast notification', async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    await mockUserEvent().click(queryBtn());

    const toast = await screen.findByRole('status');

    expect(toast).toBeInTheDocument();
  });
});