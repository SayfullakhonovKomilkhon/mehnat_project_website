import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert, InlineAlert, BannerAlert } from '@/components/ui/Alert';

describe('Alert', () => {
  it('renders children correctly', () => {
    render(<Alert>This is an alert message</Alert>);
    expect(screen.getByText('This is an alert message')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Alert title="Alert Title">Content</Alert>);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies correct type styles', () => {
    const { rerender } = render(<Alert type="info">Info</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');

    rerender(<Alert type="success">Success</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-success-light');

    rerender(<Alert type="warning">Warning</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-accent-light');

    rerender(<Alert type="error">Error</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-error-light');
  });

  it('renders dismiss button when dismissible', () => {
    render(<Alert dismissible>Dismissible alert</Alert>);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<Alert dismissible onDismiss={onDismiss}>Dismissible</Alert>);
    
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('hides icon when hideIcon is true', () => {
    render(<Alert hideIcon>No icon</Alert>);
    expect(screen.getByRole('alert').querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders action button when action is provided', () => {
    const onClick = vi.fn();
    render(
      <Alert action={{ label: 'Retry', onClick }}>
        Error occurred
      </Alert>
    );
    
    const actionButton = screen.getByRole('button', { name: 'Retry' });
    expect(actionButton).toBeInTheDocument();
    
    fireEvent.click(actionButton);
    expect(onClick).toHaveBeenCalled();
  });

  it('has role="alert" for accessibility', () => {
    render(<Alert>Alert content</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('InlineAlert', () => {
  it('renders inline with icon and text', () => {
    render(<InlineAlert>Inline message</InlineAlert>);
    expect(screen.getByText('Inline message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies correct type styles', () => {
    const { rerender } = render(<InlineAlert type="success">Success</InlineAlert>);
    expect(screen.getByRole('alert')).toHaveClass('text-success');

    rerender(<InlineAlert type="error">Error</InlineAlert>);
    expect(screen.getByRole('alert')).toHaveClass('text-error');
  });
});

describe('BannerAlert', () => {
  it('renders without horizontal borders', () => {
    render(<BannerAlert>Banner message</BannerAlert>);
    expect(screen.getByRole('alert')).toHaveClass('rounded-none');
    expect(screen.getByRole('alert')).toHaveClass('border-x-0');
  });

  it('centers content when centered prop is true', () => {
    render(<BannerAlert centered>Centered banner</BannerAlert>);
    expect(screen.getByRole('alert')).toHaveClass('justify-center');
  });
});




