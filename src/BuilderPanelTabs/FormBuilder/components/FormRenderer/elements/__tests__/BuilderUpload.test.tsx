/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderUpload from '../BuilderUpload';
import { FieldType } from '../../../../types';
import { MockFormBuilderProvider } from './MockFormBuilderProvider';

describe('BuilderUpload', () => {
  it('renders file upload dropzone with label and help text', () => {
    render(
      <MockFormBuilderProvider>
        <BuilderUpload
          field={{
            id: 'upload_demo',
            type: FieldType.UPLOAD,
            label: 'Upload Proposal',
            name: 'proposal_file',
            required: false,
            helpText: 'PDF or DOCX only',
          }}
        />
      </MockFormBuilderProvider>
    );
    expect(screen.getByText('Upload Proposal')).toBeTruthy();
    expect(screen.getByText('Click to upload file')).toBeTruthy();
    expect(screen.getByText('PDF or DOCX only')).toBeTruthy();
  });
});
