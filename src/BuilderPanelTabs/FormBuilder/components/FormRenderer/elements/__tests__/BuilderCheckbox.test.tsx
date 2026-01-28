/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderCheckbox from '../BuilderCheckbox';
import { FieldType } from '../../../../types/enums';

describe('BuilderCheckbox', () => {
  it('renders checkbox options with labels', () => {
    render(
      <BuilderCheckbox
        field={{
          id: 'checkbox_multi_demo',
          type: FieldType.CHECKBOX,
          label: 'Topics of Interest',
          name: 'interests',
          selectionMode: 'multi',
          options: [
            { label: 'Product Updates', value: 'updates' },
            { label: 'Newsletter', value: 'newsletter' },
          ],
        }}
      />
    );
    expect(screen.getByText('Topics of Interest')).toBeTruthy();
    expect(screen.getByLabelText('Product Updates')).toBeTruthy();
    expect(screen.getByLabelText('Newsletter')).toBeTruthy();
  });
});
