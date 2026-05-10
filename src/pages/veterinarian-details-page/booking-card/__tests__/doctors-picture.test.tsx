import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DoctorsPicture from '../doctors-picture';

describe('DoctorsPicture', () => {
  it('renders the image with the provided imageUrl', () => {
    render(<DoctorsPicture fullName="John Smith" imageUrl="https://example.com/photo.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
    expect(img).toHaveAttribute('alt', 'John Smith');
  });

  it('renders a fallback avatar URL when no imageUrl is provided', () => {
    render(<DoctorsPicture fullName="John Smith" />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toContain('ui-avatars.com');
    expect(img.getAttribute('src')).toContain('JS');
  });

  it('skips "Dr." prefix when computing initials', () => {
    render(<DoctorsPicture fullName="Dr. Jane Doe" />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toContain('JD');
  });

  it('uses VT as fallback initials for an empty name', () => {
    // alt="" causes role="presentation" so we query the DOM directly
    const { container } = render(<DoctorsPicture fullName="" />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toContain('VT');
  });

  it('uses first two letters for a single-word name', () => {
    render(<DoctorsPicture fullName="Smith" />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toContain('SM');
  });
});
