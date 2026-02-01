/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import FieldRenderer from '../FieldRenderer';
import { FieldType, HeadingLevel, ButtonAction } from '../../../types';
import { Field } from '../../../types';
import { MockFormBuilderProvider } from '../elements/__tests__/MockFormBuilderProvider';

describe('FieldRenderer', () => {
  it('should render text field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_text',
            type: FieldType.TEXT,
            label: 'Test Text Field',
            name: 'test_text',
            placeholder: 'Enter text',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Test Text Field')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render email field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_email',
            type: FieldType.EMAIL,
            label: 'Email Address',
            name: 'email',
            placeholder: 'test@example.com',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Email Address')).toBeTruthy();
    expect(screen.getByPlaceholderText('test@example.com')).toBeTruthy();
  });

  it('should render heading field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_heading',
            type: FieldType.HEADING,
            label: 'Welcome',
            headingLevel: HeadingLevel.H1,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Welcome')).toBeTruthy();
  });

  it('should render paragraph field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_paragraph',
            type: FieldType.PARAGRAPH,
            label: 'Description text here',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Description text here')).toBeTruthy();
  });

  it('should render checkbox field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_checkbox',
            type: FieldType.CHECKBOX,
            label: 'Select Options',
            name: 'options',
            selectionMode: 'multi',
            options: [
              { label: 'Option 1', value: 'opt1' },
              { label: 'Option 2', value: 'opt2' },
            ],
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Select Options')).toBeTruthy();
    expect(screen.getByLabelText('Option 1')).toBeTruthy();
    expect(screen.getByLabelText('Option 2')).toBeTruthy();
  });

  it('should render radio field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_radio',
            type: FieldType.RADIO,
            label: 'Choose One',
            name: 'choice',
            options: [
              { label: 'Choice A', value: 'a' },
              { label: 'Choice B', value: 'b' },
            ],
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Choose One')).toBeTruthy();
    expect(screen.getByLabelText('Choice A')).toBeTruthy();
    expect(screen.getByLabelText('Choice B')).toBeTruthy();
  });

  it('should render dropdown field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_dropdown',
            type: FieldType.DROPDOWN,
            label: 'Select Department',
            name: 'department',
            options: [
              { label: 'Sales', value: 'sales' },
              { label: 'Support', value: 'support' },
            ],
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Sales')).toBeTruthy();
    expect(screen.getByText('Support')).toBeTruthy();
  });

  it('should render textarea field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_textarea',
            type: FieldType.TEXTAREA,
            label: 'Message',
            name: 'message',
            placeholder: 'Enter message',
            rows: 5,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Message')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter message')).toBeTruthy();
  });

  it('should render number field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_number',
            type: FieldType.NUMBER,
            label: 'Age',
            name: 'age',
            placeholder: '25',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Age')).toBeTruthy();
    expect(screen.getByPlaceholderText('25')).toBeTruthy();
  });

  it('should render phone field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_phone',
            type: FieldType.PHONE,
            label: 'Phone Number',
            name: 'phone',
            placeholder: '+1 (555) 000-0000',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Phone Number')).toBeTruthy();
    expect(screen.getByPlaceholderText('+1 (555) 000-0000')).toBeTruthy();
  });

  it('should render url field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_url',
            type: FieldType.URL,
            label: 'Website',
            name: 'website',
            placeholder: 'https://',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Website')).toBeTruthy();
    expect(screen.getByPlaceholderText('https://')).toBeTruthy();
  });

  it('should render date field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_date',
            type: FieldType.DATE,
            label: 'Start Date',
            name: 'start_date',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Start Date')).toBeTruthy();
  });

  it('should render time field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_time',
            type: FieldType.TIME,
            label: 'Appointment Time',
            name: 'time',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Appointment Time')).toBeTruthy();
  });

  it('should render upload field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_upload',
            type: FieldType.UPLOAD,
            label: 'Upload File',
            name: 'file',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Upload File')).toBeTruthy();
  });

  it('should render button field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_button',
            type: FieldType.BUTTON,
            label: 'Submit',
            action: ButtonAction.SUBMIT,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();
  });

  it('should render divider field component', () => {
    const { container } = render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_divider',
            type: FieldType.DIVIDER,
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(container.querySelector('hr')).toBeTruthy();
  });

  it('should render captcha field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_captcha',
            type: FieldType.CAPTCHA,
            label: 'Verify you are human',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Verify you are human')).toBeTruthy();
  });

  it('should render image field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_image',
            type: FieldType.IMAGE,
            label: 'Product Image',
            url: 'https://example.com/image.jpg',
            altText: 'Product',
          }}
        />
      </MockFormBuilderProvider>
    );
    const img = screen.getByAltText('Product');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/image.jpg');
  });

  it('should render video field component', () => {
    render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_video',
            type: FieldType.VIDEO,
            label: 'Demo Video',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            altText: 'Demo',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Demo Video')).toBeTruthy();
  });

  it('should return null for unsupported field type', () => {
    const { container } = render(
      <MockFormBuilderProvider>
        <FieldRenderer
          field={{
            id: 'test_invalid',
            type: 'invalid_type' as any,
            label: 'Invalid Field',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should pass field prop to child component correctly', () => {
    const field: Field = {
      id: 'test_field',
      type: FieldType.TEXT,
      label: 'Test Label',
      name: 'test_name',
      placeholder: 'Test placeholder',
      required: true,
      helpText: 'Help text',
    };

    render(
      <MockFormBuilderProvider>
        <FieldRenderer field={field} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Test Label')).toBeTruthy();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeTruthy();
    expect(screen.getByText('Help text')).toBeTruthy();
  });
});
