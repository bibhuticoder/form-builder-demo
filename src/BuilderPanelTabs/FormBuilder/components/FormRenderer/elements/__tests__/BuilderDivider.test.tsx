/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import BuilderDivider from '../BuilderDivider';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderDivider', () => {
  it('renders a divider (div)', () => {
    const { container } = render(
      <MockFormBuilderProvider>
        <BuilderDivider
          field={{
            id: 'divider_demo',
            type: FieldType.DIVIDER,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(container.querySelector('.h-0\\.5')).toBeTruthy();
  });
});
