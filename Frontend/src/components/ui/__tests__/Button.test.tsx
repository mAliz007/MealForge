// frontend/src/components/ui/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders button with text correctly', () => {
    render(<Button variant="primary">Click Me</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', async () => {
    const handleClick = vi.fn(); // Creates an automated mock spy function
    const user = userEvent.setup();
    
    render(<Button variant="primary" onClick={handleClick}>Click Me</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    await user.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state and disables the button when isLoading is true', () => {
    render(<Button variant="primary" isLoading={true}>Submit</Button>);
    
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });
});