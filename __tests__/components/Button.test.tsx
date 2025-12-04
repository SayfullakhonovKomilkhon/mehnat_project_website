import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when isLoading prop is true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toContainElement(
      screen.getByRole('button').querySelector('.animate-spin')
    );
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-800');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-50');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-2');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-error');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-13');
  });

  it('renders with left icon', () => {
    render(<Button leftIcon={<span data-testid="left-icon">←</span>}>With Icon</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(<Button rightIcon={<span data-testid="right-icon">→</span>}>With Icon</Button>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies fullWidth class when prop is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('has correct accessibility attributes when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
});



