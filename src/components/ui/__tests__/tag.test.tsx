import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { Tag } from '~/components/ui/tag';

describe('Tag', () => {
  it('renders label text', () => {
    render(<Tag label="General" />);

    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('uses pink variant by default', () => {
    render(<Tag label="Default" />);

    expect(screen.getByText('Default').className).toContain('text-pink-600');
  });

  it('applies provided variant and className', () => {
    render(<Tag label="Special" variant="blue" className="my-tag" />);

    const tag = screen.getByText('Special');
    expect(tag.className).toContain('bg-blue-300');
    expect(tag.className).toContain('my-tag');
  });
});
