/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderHeading from '../BuilderHeading';
import { FieldType, HeadingLevel } from '../../../../types/enums';

describe('BuilderHeading', () => {
  it('renders the correct heading level and label', () => {
    render(
      <BuilderHeading
        field={{
          id: 'heading_demo',
          type: FieldType.HEADING,
          label: 'Welcome to our Form',
          headingLevel: HeadingLevel.H1,
          style: { fontSize: '32' },
        }}
      />
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.getByText('Welcome to our Form')).toBeTruthy();
  });
});
