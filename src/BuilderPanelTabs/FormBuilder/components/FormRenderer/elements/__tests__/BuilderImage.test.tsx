/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderImage from '../BuilderImage';
import { FieldType } from '../../../../types/enums';

describe('BuilderImage', () => {
  it('renders image with alt text', () => {
    render(
      <BuilderImage
        field={{
          id: 'image_demo',
          type: FieldType.IMAGE,
          label: 'Product Screenshot',
          url: 'https://placehold.co/600x400',
          altText: 'Dashboard preview',
        }}
      />
    );
    expect(screen.getByAltText('Dashboard preview')).toBeTruthy();
    expect(screen.getByText('Product Screenshot')).toBeTruthy();
  });
});
