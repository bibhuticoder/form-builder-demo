/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderTime from '../BuilderTime';
import { FieldType } from '../../../../types/enums';

describe('BuilderTime', () => {
  it('renders time input with label', () => {
    render(
      <BuilderTime
        field={{
          id: 'time_demo',
          type: FieldType.TIME,
          label: 'Best Time to Call',
          name: 'call_time',
          required: false,
        }}
      />
    );
    expect(screen.getByText('Best Time to Call')).toBeTruthy();
  });
});
