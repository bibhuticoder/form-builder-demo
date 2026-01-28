/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderDropdown from '../BuilderDropdown';
import { FieldType } from '../../../../types/enums';

describe('BuilderDropdown', () => {
  it('renders select with options', () => {
    render(
      <BuilderDropdown
        field={{
          id: 'dropdown_demo',
          type: FieldType.DROPDOWN,
          label: 'Select Department',
          name: 'department',
          required: true,
          options: [
            { label: 'Sales', value: 'sales' },
            { label: 'Support', value: 'support' },
            { label: 'Engineering', value: 'engineering' },
          ],
        }}
      />
    );
    expect(screen.getByText('Select Department')).toBeTruthy();
    expect(screen.getByText('Sales')).toBeTruthy();
    expect(screen.getByText('Support')).toBeTruthy();
    expect(screen.getByText('Engineering')).toBeTruthy();
  });
});
