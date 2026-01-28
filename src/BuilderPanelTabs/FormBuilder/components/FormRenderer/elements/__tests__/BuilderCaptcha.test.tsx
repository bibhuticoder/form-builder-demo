/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderCaptcha from '../BuilderCaptcha';
import { FieldType } from '../../../../types/enums';

describe('BuilderCaptcha', () => {
  it('renders a captcha placeholder', () => {
    render(
      <BuilderCaptcha
        field={{
          id: 'captcha_demo',
          type: FieldType.CAPTCHA,
          label: 'Security Verification',
        }}
      />
    );
    expect(screen.getByText('Security Verification')).toBeTruthy();
  });
});
