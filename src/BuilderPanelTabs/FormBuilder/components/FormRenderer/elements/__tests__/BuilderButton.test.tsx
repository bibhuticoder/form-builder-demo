/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import FormBuilderButton from '../BuilderButton';
import { FieldType, ButtonAction } from '../../../../types/enums';

describe('FormBuilderButton', () => {
  it('renders the submit button with label', () => {
    render(
      <FormBuilderButton
        field={{
          id: 'submit_btn',
          type: FieldType.BUTTON,
          label: 'Send Message',
          action: ButtonAction.SUBMIT,
          style: {
            backgroundColor: '#4F46E5',
            color: '#FFFFFF',
            width: 'full',
            borderRadius: 8,
            fontWeight: 'bold',
          },
        }}
      />
    );
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeTruthy();
  });
});
