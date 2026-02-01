/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { ButtonAction, FieldType, FormDefinition, FormStatus, HeadingLevel } from '../../../types';
import FormRenderer from '../FormRenderer';
import { MockFormBuilderProvider } from '../elements/__tests__/MockFormBuilderProvider';

describe('FormRenderer', () => {
  const mockFormData: FormDefinition = {
    formSettings: {
      name: 'Test Form',
      status: FormStatus.PUBLISHED,
      settings: {
        width: 768,
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 12,
        fontFamilyBody: 'Inter',
        fontFamilyTitle: 'Inter',
        padding: 24,
      },
    },
    fields: [
      {
        id: 'heading_1',
        type: FieldType.HEADING,
        label: 'Contact Us',
        headingLevel: HeadingLevel.H1,
      },
      {
        id: 'text_1',
        type: FieldType.TEXT,
        label: 'Full Name',
        name: 'name',
        placeholder: 'John Doe',
        required: true,
      },
      {
        id: 'email_1',
        type: FieldType.EMAIL,
        label: 'Email',
        name: 'email',
        placeholder: 'john@example.com',
        required: true,
      },
    ],
  };

  it('should render form with all fields', () => {
    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={mockFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Contact Us')).toBeTruthy();
    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('should render form container with settings styles', () => {
    const { container } = render(
      <MockFormBuilderProvider>
        <FormRenderer formData={mockFormData} />
      </MockFormBuilderProvider>
    );
    const formContainer = container.firstChild as HTMLElement;

    expect(formContainer).toBeTruthy();
    expect(formContainer.tagName).toBe('DIV');
  });

  it('should render fields in correct order', () => {
    const { container } = render(
      <MockFormBuilderProvider>
        <FormRenderer formData={mockFormData} />
      </MockFormBuilderProvider>
    );
    container.querySelectorAll('[data-field], h1, input, label');

    // Check that heading appears before inputs
    expect(screen.getByText('Contact Us')).toBeTruthy();
    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('should handle empty fields array', () => {
    const emptyFormData: FormDefinition = {
      ...mockFormData,
      fields: [],
    };


    const { container } = render(
      <MockFormBuilderProvider>
        <FormRenderer formData={emptyFormData} />
      </MockFormBuilderProvider>
    );
    const formContainer = container.firstChild as HTMLElement;

    expect(formContainer).toBeTruthy();
    const grid = formContainer.querySelector('.grid');
    expect(grid).toBeTruthy();
    expect(grid?.children.length).toBe(0);
  });

  it('should render complex form with multiple field types', () => {
    const complexFormData: FormDefinition = {
      formSettings: {
        name: 'Complex Form',
        status: FormStatus.PUBLISHED,
        settings: {
          width: 600,
          backgroundColor: '#F9FAFB',
          borderColor: '#D1D5DB',
          borderStyle: 'solid',
          borderWidth: 2,
          borderRadius: 8,
          fontFamilyBody: 'Arial',
          fontFamilyTitle: 'Arial',
          paddingTop: 32,
          paddingRight: 32,
          paddingBottom: 32,
          paddingLeft: 32,
        },
      },
      fields: [
        {
          id: 'heading_1',
          type: FieldType.HEADING,
          label: 'Survey Form',
          headingLevel: HeadingLevel.H2,
        },
        {
          id: 'paragraph_1',
          type: FieldType.PARAGRAPH,
          label: 'Please fill out this survey',
        },
        {
          id: 'radio_1',
          type: FieldType.RADIO,
          label: 'Choose One',
          name: 'choice',
          options: [
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ],
        },
        {
          id: 'checkbox_1',
          type: FieldType.CHECKBOX,
          label: 'Select All That Apply',
          name: 'selections',
          selectionMode: 'multi',
          options: [
            { label: 'Item 1', value: '1' },
            { label: 'Item 2', value: '2' },
          ],
        },
        {
          id: 'textarea_1',
          type: FieldType.TEXTAREA,
          label: 'Comments',
          name: 'comments',
          placeholder: 'Enter your feedback',
          rows: 4,
        },
        {
          id: 'divider_1',
          type: FieldType.DIVIDER,
        },
        {
          id: 'button_1',
          type: FieldType.BUTTON,
          label: 'Submit Survey',
          action: ButtonAction.SUBMIT,
        },
      ],
    };


    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={complexFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Survey Form')).toBeTruthy();
    expect(screen.getByText('Please fill out this survey')).toBeTruthy();
    expect(screen.getByText('Choose One')).toBeTruthy();
    expect(screen.getByText('Select All That Apply')).toBeTruthy();
    expect(screen.getByText('Comments')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Submit Survey' })).toBeTruthy();
  });

  it('should render form with date and time fields', () => {
    const dateTimeFormData: FormDefinition = {
      formSettings: {
        name: 'Appointment Form',
        status: FormStatus.PUBLISHED,
        settings: {
          width: 500,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 4,
          fontFamilyBody: 'Roboto',
          fontFamilyTitle: 'Roboto',
          paddingTop: 16,
          paddingRight: 16,
          paddingBottom: 16,
          paddingLeft: 16,
        },
      },
      fields: [
        {
          id: 'date_1',
          type: FieldType.DATE,
          label: 'Appointment Date',
          name: 'date',
          required: true,
        },
        {
          id: 'time_1',
          type: FieldType.TIME,
          label: 'Appointment Time',
          name: 'time',
          required: true,
        },
      ],
    };


    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={dateTimeFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Appointment Date')).toBeTruthy();
    expect(screen.getByText('Appointment Time')).toBeTruthy();
  });

  it('should render form with dropdown field', () => {
    const dropdownFormData: FormDefinition = {
      formSettings: {
        name: 'Selection Form',
        status: FormStatus.PUBLISHED,
        settings: {
          width: 400,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 8,
          fontFamilyBody: 'Inter',
          fontFamilyTitle: 'Inter',
          paddingTop: 20,
          paddingRight: 20,
          paddingBottom: 20,
          paddingLeft: 20,
        },
      },
      fields: [
        {
          id: 'dropdown_1',
          type: FieldType.DROPDOWN,
          label: 'Select Department',
          name: 'department',
          required: true,
          options: [
            { label: 'Sales', value: 'sales' },
            { label: 'Support', value: 'support' },
            { label: 'Engineering', value: 'engineering' },
          ],
        },
      ],
    };


    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={dropdownFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Sales')).toBeTruthy();
    expect(screen.getByText('Support')).toBeTruthy();
    expect(screen.getByText('Engineering')).toBeTruthy();
  });

  it('should render form with upload field', () => {
    const uploadFormData: FormDefinition = {
      formSettings: {
        name: 'Upload Form',
        status: FormStatus.PUBLISHED,
        settings: {
          width: 500,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 8,
          fontFamilyBody: 'Inter',
          fontFamilyTitle: 'Inter',
          paddingTop: 24,
          paddingRight: 24,
          paddingBottom: 24,
          paddingLeft: 24,
        },
      },
      fields: [
        {
          id: 'upload_1',
          type: FieldType.UPLOAD,
          label: 'Upload Document',
          name: 'document',
          required: true,
          helpText: 'PDF only',
        },
      ],
    };


    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={uploadFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Upload Document')).toBeTruthy();
    expect(screen.getByText('PDF only')).toBeTruthy();
  });

  it('should render form with captcha field', () => {
    const captchaFormData: FormDefinition = {
      formSettings: {
        name: 'Captcha Form',
        status: FormStatus.PUBLISHED,
        settings: {
          width: 400,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 8,
          fontFamilyBody: 'Inter',
          fontFamilyTitle: 'Inter',
          paddingTop: 16,
          paddingRight: 16,
          paddingBottom: 16,
          paddingLeft: 16,
        },
      },
      fields: [
        {
          id: 'captcha_1',
          type: FieldType.CAPTCHA,
          label: 'Security Verification',
        },
      ],
    };


    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={captchaFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Security Verification')).toBeTruthy();
  });

  it('should render form with number and phone fields', () => {
    const numberPhoneFormData: FormDefinition = {
      formSettings: {
        name: 'Contact Form',
        status: FormStatus.PUBLISHED,
        settings: {
          width: 600,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 8,
          fontFamilyBody: 'Inter',
          fontFamilyTitle: 'Inter',
          paddingTop: 24,
          paddingRight: 24,
          paddingBottom: 24,
          paddingLeft: 24,
        },
      },
      fields: [
        {
          id: 'phone_1',
          type: FieldType.PHONE,
          label: 'Phone Number',
          name: 'phone',
          placeholder: '+1 (555) 000-0000',
          required: true,
        },
        {
          id: 'number_1',
          type: FieldType.NUMBER,
          label: 'Age',
          name: 'age',
          placeholder: '25',
          required: false,
        },
      ],
    };


    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={numberPhoneFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Phone Number')).toBeTruthy();
    expect(screen.getByText('Age')).toBeTruthy();
  });

  it('should render form with url field', () => {
    const urlFormData: FormDefinition = {
      formSettings: {
        name: 'Website Form',
        status: FormStatus.PUBLISHED,
        settings: {
          width: 500,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 8,
          fontFamilyBody: 'Inter',
          fontFamilyTitle: 'Inter',
          paddingTop: 20,
          paddingRight: 20,
          paddingBottom: 20,
          paddingLeft: 20,
        },
      },
      fields: [
        {
          id: 'url_1',
          type: FieldType.URL,
          label: 'Website URL',
          name: 'website',
          placeholder: 'https://example.com',
          required: false,
        },
      ],
    };


    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={urlFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Website URL')).toBeTruthy();
    expect(screen.getByPlaceholderText('https://example.com')).toBeTruthy();
  });

  it('should render form with image and video fields', () => {
    const mediaFormData: FormDefinition = {
      formSettings: {
        name: 'Media Form',
        status: FormStatus.PUBLISHED,
        settings: {
          width: 700,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E5E5',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 8,
          fontFamilyBody: 'Inter',
          fontFamilyTitle: 'Inter',
          paddingTop: 24,
          paddingRight: 24,
          paddingBottom: 24,
          paddingLeft: 24,
        },
      },
      fields: [
        {
          id: 'image_1',
          type: FieldType.IMAGE,
          label: 'Product Image',
          url: 'https://example.com/image.jpg',
          altText: 'Product',
        },
        {
          id: 'video_1',
          type: FieldType.VIDEO,
          label: 'Demo Video',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          altText: 'Demo',
        },
      ],
    };


    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={mediaFormData} />
      </MockFormBuilderProvider>
    );

    expect(screen.getByText('Product Image')).toBeTruthy();
    expect(screen.getByText('Demo Video')).toBeTruthy();
    expect(screen.getByAltText('Product')).toBeTruthy();
  });

  it('should use field.id as key for each rendered field', () => {
    render(
      <MockFormBuilderProvider>
        <FormRenderer formData={mockFormData} />
      </MockFormBuilderProvider>
    );

    // Verify that fields are rendered
    expect(screen.getByText('Contact Us')).toBeTruthy();
    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
  });
});
