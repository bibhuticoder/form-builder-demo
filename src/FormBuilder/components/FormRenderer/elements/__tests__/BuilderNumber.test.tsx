/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderNumber from '../BuilderNumber';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderNumber', () => {
  it('renders number input with label and placeholder', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderNumber
          field={{
            id: 'number_demo',
            type: FieldType.NUMBER,
            label: 'Employee Count',
            name: 'employee_count',
            placeholder: '100',
            required: false,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Employee Count')).toBeTruthy();
    expect(screen.getByPlaceholderText('100')).toBeTruthy();
  });
});
