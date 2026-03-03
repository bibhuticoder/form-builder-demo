/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderImage from '../BuilderImage';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderImage', () => {
  it('renders image with alt text', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderImage
          field={{
            id: 'image_demo',
            type: FieldType.IMAGE,
            label: 'Product Screenshot',
            url: 'https://placehold.co/600x400',
            altText: 'Dashboard preview',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByAltText('Dashboard preview')).toBeTruthy();
    expect(screen.getByText('Product Screenshot')).toBeTruthy();
  });
});
