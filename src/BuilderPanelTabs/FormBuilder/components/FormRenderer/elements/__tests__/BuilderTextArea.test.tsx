/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderTextArea from '../BuilderTextArea';
import { FieldType } from '../../../../types/enums';

describe('BuilderTextArea', () => {
  it('renders textarea with label and placeholder', () => {
    render(
      <BuilderTextArea
        field={{
          id: 'textarea_demo',
          type: FieldType.TEXTAREA,
          label: 'Your Message',
          name: 'message',
          placeholder: 'Tell us more...',
          required: true,
          rows: 5,
        }}
      />
    );
    expect(screen.getByText('Your Message')).toBeTruthy();
    expect(screen.getByPlaceholderText('Tell us more...')).toBeTruthy();
  });
});
