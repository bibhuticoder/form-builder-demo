/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderCaptcha from '../BuilderCaptcha';
import { FieldType } from '../../../../types/enums';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderCaptcha', () => {
  it('renders a captcha placeholder', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderCaptcha
          field={{
            id: 'captcha_demo',
            type: FieldType.CAPTCHA,
            label: 'Security Verification',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Security Verification')).toBeTruthy();
  });
});
