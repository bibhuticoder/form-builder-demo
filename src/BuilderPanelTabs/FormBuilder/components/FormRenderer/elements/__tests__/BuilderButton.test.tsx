/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import FormBuilderButton from '../BuilderButton';
import { ButtonAction, FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('FormBuilderButton', () => {
  it('renders the submit button with label', () => {
    render(
      <MockFormBuilderProvider>
        <FormBuilderButton
          field={{
            id: 'submit_btn',
            type: FieldType.BUTTON,
            label: 'Send Message',
            action: ButtonAction.SUBMIT,
            style: {
              md: {
                inputBackgroundColor: '#4F46E5',
                width: 'full',
              },
            },
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeTruthy();
  });
});
