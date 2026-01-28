/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderParagraph from '../BuilderParagraph';
import { FieldType } from '../../../../types/enums';

describe('BuilderParagraph', () => {
  it('renders paragraph text', () => {
    render(
      <BuilderParagraph
        field={{
          id: 'paragraph_demo',
          type: FieldType.PARAGRAPH,
          label: 'Please fill out the information below completely.',
          style: { fontSize: '16' },
        }}
      />
    );
    expect(screen.getByText('Please fill out the information below completely.')).toBeTruthy();
  });
});
