// Example: integration test for a Dialog inside a Form
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

test('Dialog inside Form submits and restores focus', async () => {
  const user = userEvent.setup();
  render(<SettingsFormWithConfirmDialog />);
  await user.click(screen.getByRole('button', { name: /save/i }));
  await user.click(screen.getByRole('button', { name: /confirm/i }));
  expect(screen.getByRole('button', { name: /save/i })).toHaveFocus();
});
