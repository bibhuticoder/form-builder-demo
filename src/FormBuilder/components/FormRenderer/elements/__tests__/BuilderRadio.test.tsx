/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderRadio from '../BuilderRadio';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderRadio', () => {
  it('renders radio options with labels', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderRadio
          field={{
            id: 'radio_demo',
            type: FieldType.RADIO,
            label: 'Preferred Contact Method',
            name: 'contact_preference',
            required: true,
            options: [
              { label: 'Email', value: 'email' },
              { label: 'Phone', value: 'phone' },
            ],
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Preferred Contact Method')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Phone')).toBeTruthy();
  });
});
