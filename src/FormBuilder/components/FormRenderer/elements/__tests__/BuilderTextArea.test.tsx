/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderTextArea from '../BuilderTextArea';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderTextArea', () => {
  it('renders textarea with label and placeholder', () => {
    render(
      <MockFormBuilderProvider>
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
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Your Message')).toBeTruthy();
    expect(screen.getByPlaceholderText('Tell us more...')).toBeTruthy();
  });
});
