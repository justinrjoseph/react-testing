import { render, screen } from '@testing-library/react';

import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
  it('should return nothing when no image URLs', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('<list of images>', () => {
    const imageUrls = ['a', 'b' ];

    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole('img');

    expect(images.length).toBe(imageUrls.length);

    images.forEach((item, i) => {
      expect(item).toHaveAttribute('src', imageUrls[i]);
    });
  });
});