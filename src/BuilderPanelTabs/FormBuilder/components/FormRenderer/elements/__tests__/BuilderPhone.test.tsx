/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderPhone from '../BuilderPhone';
import { FieldType } from '../../../../types/enums';

describe('BuilderPhone', () => {
  it('renders phone input with label and placeholder', () => {
    render(
      <BuilderPhone
        field={{
          id: 'phone_demo',
          type: FieldType.PHONE,
          label: 'Phone Number',
          name: 'phone',
          placeholder: '+1 (555) 000-0000',
          required: false,
        }}
      />
    );
    expect(screen.getByText('Phone Number')).toBeTruthy();
    expect(screen.getByPlaceholderText('+1 (555) 000-0000')).toBeTruthy();
  });
});
