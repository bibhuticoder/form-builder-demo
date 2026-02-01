/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderDate from '../BuilderDate';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderDate', () => {
  it('renders date input with label', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderDate
          field={{
            id: 'date_demo',
            type: FieldType.DATE,
            label: 'Desired Start Date',
            name: 'start_date',
            required: false,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Desired Start Date')).toBeTruthy();
  });
});
