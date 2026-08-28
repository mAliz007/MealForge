// frontend/src/components/forms/__tests__/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../LoginForm';

describe('LoginForm Component Validation', () => {
  it('displays real-time inline validation errors on empty submission', async () => {
    const handleSuccess = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmitSuccess={handleSuccess} />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Updated to match your exact schema messages: "Email is required" / "Password is required"
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(handleSuccess).not.toHaveBeenCalled();
  });

  it('triggers onSubmitSuccess with validated fields on successful submission', async () => {
    const handleSuccess = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmitSuccess={handleSuccess} />);

    await user.type(screen.getByLabelText(/email address/i), 'admin@dining.com');
    await user.type(screen.getByLabelText(/password/i), 'securepassword123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Target the first argument of the first call explicitly to bypass the trailing event arg
    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalled();
      const submittedData = handleSuccess.mock.calls[0][0];
      expect(submittedData).toEqual({
        email: 'admin@dining.com',
        password: 'securepassword123',
      });
    });
  });
});