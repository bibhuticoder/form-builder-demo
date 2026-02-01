/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderTime from '../BuilderTime';
import { FieldType } from '../../../../types';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderTime', () => {
  it('renders time input with label', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderTime
          field={{
            id: 'time_demo',
            type: FieldType.TIME,
            label: 'Best Time to Call',
            name: 'call_time',
            required: false,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Best Time to Call')).toBeTruthy();
  });
});
