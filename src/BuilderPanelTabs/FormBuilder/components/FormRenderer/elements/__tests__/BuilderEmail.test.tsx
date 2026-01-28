/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderEmail from '../BuilderEmail';
import { FieldType } from '../../../../types/enums';

describe('BuilderEmail', () => {
  it('renders email input with label and placeholder', () => {
    render(
      <BuilderEmail
        field={{
          id: 'email_demo',
          type: FieldType.EMAIL,
          label: 'Email Address',
          name: 'email',
          placeholder: 'jane@company.com',
          required: true,
        }}
      />
    );
    expect(screen.getByText('Email Address')).toBeTruthy();
    expect(screen.getByPlaceholderText('jane@company.com')).toBeTruthy();
  });
});
