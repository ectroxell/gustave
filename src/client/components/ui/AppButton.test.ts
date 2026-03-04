import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import AppButton from './AppButton.vue';

describe('AppButton', () => {
  it('renders slot content', () => {
    render(AppButton, { slots: { default: 'Click me' } });
    expect(screen.getByRole('button', { name: 'Click me' }))
      .toBeInTheDocument();
  });

  it('applies primary variant classes by default', () => {
    render(AppButton, { slots: { default: 'Primary' } });
    const button = screen.getByRole('button');
    expect(button.className)
      .toContain('bg-accent-green');
  });

  it('applies danger variant classes', () => {
    render(AppButton, {
      props: { variant: 'danger' },
      slots: { default: 'Delete' },
    });
    const button = screen.getByRole('button');
    expect(button.className)
      .toContain('bg-accent-red');
  });

  it('is disabled when disabled prop is true', () => {
    render(AppButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    });
    expect(screen.getByRole('button'))
      .toBeDisabled();
  });

  it('emits click events', async () => {
    const user = userEvent.setup();
    const { emitted } = render(AppButton, { slots: { default: 'Click' } });

    await user.click(screen.getByRole('button'));
    expect(emitted())
      .toHaveProperty('click');
  });
});
