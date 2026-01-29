/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderVideo from '../BuilderVideo';
import { FieldType } from '../../../../../../types';

describe('BuilderVideo', () => {
  it('renders video iframe with title', () => {
    render(
      <BuilderVideo
        field={{
          id: 'video_demo',
          type: FieldType.VIDEO,
          label: 'Demo Video',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          altText: 'Product Walkthrough',
        }}
      />
    );
    expect(screen.getByTitle('Product Walkthrough')).toBeTruthy();
    expect(screen.getByText('Demo Video')).toBeTruthy();
  });
});
