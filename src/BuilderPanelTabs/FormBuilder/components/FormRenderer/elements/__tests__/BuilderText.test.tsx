/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderText from '../BuilderText';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderText', () => {
  it('renders label and input with placeholder', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderText
          field={{
            id: 'fname_demo',
            type: FieldType.TEXT,
            label: 'First Name',
            name: 'first_name',
            placeholder: 'Jane',
            required: true,
            helpText: 'Your given name',
            style: { md: { width: 'half' } },
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('First Name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Jane')).toBeTruthy();
    expect(screen.getByText('Your given name')).toBeTruthy();
  });
});
