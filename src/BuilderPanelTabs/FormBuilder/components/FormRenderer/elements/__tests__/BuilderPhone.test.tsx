/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderPhone from '../BuilderPhone';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderPhone', () => {
  it('renders phone input with label and placeholder', () => {
    render(
      <MockFormBuilderProvider>
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
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Phone Number')).toBeTruthy();
    expect(screen.getByPlaceholderText('+1 (555) 000-0000')).toBeTruthy();
  });
});
