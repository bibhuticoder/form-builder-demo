/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import BuilderDivider from '../BuilderDivider';
import { FieldType } from '../../../../types/enums';

describe('BuilderDivider', () => {
  it('renders a divider (hr)', () => {
    const { container } = render(
      <BuilderDivider
        field={{
          id: 'divider_demo',
          type: FieldType.DIVIDER,
        }}
      />
    );
    expect(container.querySelector('hr')).toBeTruthy();
  });
});
