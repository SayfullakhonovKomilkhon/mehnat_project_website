import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, GovVerifiedBadge } from '@/components/ui/Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-gov-border');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary-100');

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-success-light');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('bg-accent-light');

    rerender(<Badge variant="error">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-error-light');

    rerender(<Badge variant="gov">Government</Badge>);
    expect(screen.getByText('Government')).toHaveClass('bg-primary-800');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('text-xs');

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('text-base');
  });

  it('renders with pill shape by default', () => {
    render(<Badge>Pill</Badge>);
    expect(screen.getByText('Pill')).toHaveClass('rounded-full');
  });

  it('renders with rounded shape when pill is false', () => {
    render(<Badge pill={false}>Rounded</Badge>);
    expect(screen.getByText('Rounded')).toHaveClass('rounded-md');
  });

  it('renders with icon when provided', () => {
    render(<Badge icon="check">With Icon</Badge>);
    expect(screen.getByText('With Icon').querySelector('svg')).toBeInTheDocument();
  });

  it('renders with dot indicator', () => {
    render(<Badge dot>With Dot</Badge>);
    const dot = screen.getByText('With Dot').querySelector('.rounded-full.w-1\\.5');
    expect(dot).toBeInTheDocument();
  });

  it('applies outline styles when outline prop is true', () => {
    render(<Badge outline variant="primary">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('border');
    expect(screen.getByText('Outline')).toHaveClass('bg-transparent');
  });
});

describe('GovVerifiedBadge', () => {
  it('renders with government styling', () => {
    render(<GovVerifiedBadge>Verified</GovVerifiedBadge>);
    const badge = screen.getByText('Verified');
    expect(badge).toHaveClass('bg-primary-800');
    expect(badge).toHaveClass('shadow-sm');
  });

  it('renders shield icon', () => {
    render(<GovVerifiedBadge>Verified</GovVerifiedBadge>);
    expect(screen.getByText('Verified').querySelector('svg')).toBeInTheDocument();
  });
});



