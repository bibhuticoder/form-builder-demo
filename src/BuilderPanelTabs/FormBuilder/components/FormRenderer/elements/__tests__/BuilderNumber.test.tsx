/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderNumber from '../BuilderNumber';
import { FieldType } from '../../../../types/enums';

describe('BuilderNumber', () => {
  it('renders number input with label and placeholder', () => {
    render(
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
    );
    expect(screen.getByText('Employee Count')).toBeTruthy();
    expect(screen.getByPlaceholderText('100')).toBeTruthy();
  });
});
