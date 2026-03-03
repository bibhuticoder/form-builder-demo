/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderUrl from '../BuilderUrl';
import { FieldType } from '../../../../types';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderUrl', () => {
  it('renders url input with label and placeholder', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderUrl
          field={{
            id: 'website_demo',
            type: FieldType.URL,
            label: 'Website URL',
            name: 'website',
            placeholder: 'https://',
            required: false,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Website URL')).toBeTruthy();
    expect(screen.getByPlaceholderText('https://')).toBeTruthy();
  });
});
