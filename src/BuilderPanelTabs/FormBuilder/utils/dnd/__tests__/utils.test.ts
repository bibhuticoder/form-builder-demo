/**
 * @jest-environment jsdom
 */
import { createFieldFromType } from '../utils';
import { FieldType } from '../../../types/enums';
import { DateField, EmailField, InputField } from '../../../types';

describe('dnd/utils', () => {
  describe('createFieldFromType', () => {
    it('should generate unique IDs for each field', () => {
      const field1 = createFieldFromType(FieldType.TEXT, 'Name');
      const field2 = createFieldFromType(FieldType.TEXT, 'Name', [field1]);

      expect(field1.id).not.toBe(field2.id);
    });

    it('should create a text field with correct defaults', () => {
      const field = createFieldFromType(FieldType.TEXT, 'Full Name') as InputField;

      expect(field.type).toBe(FieldType.TEXT);
      expect(field.label).toBe('Full Name');
      // expect(field.name).toBe('full_name'); // Name removed from creation
      expect(field.placeholder).toBe('Enter full name');
      expect(field.required).toBe(false);
    });

    it('should create an email field with correct defaults', () => {
      const field = createFieldFromType(FieldType.EMAIL, 'Email Address') as EmailField;

      expect(field.type).toBe(FieldType.EMAIL);
      expect(field.label).toBe('Email Address');
      // expect(field.name).toBe('email_address'); // Name removed from creation
      expect(field.placeholder).toBe('Enter email address');
      expect(field.required).toBe(false);
    });

    it('should create a checkbox field with default options', () => {
      const field = createFieldFromType(FieldType.CHECKBOX, 'Preferences') as any;

      expect(field.type).toBe(FieldType.CHECKBOX);
      expect(field.label).toBe('Preferences');
      // expect(field.name).toBe('preferences'); // Name removed from creation
      expect(field.options).toBeDefined();
      expect(field.options).toHaveLength(2);
      expect(field.options[0].label).toBe('Option 1');
      expect(field.options[0].value).toBe('option1');
      expect(field.options[1].label).toBe('Option 2');
      expect(field.options[1].value).toBe('option2');
    });

    it('should create a radio field with default options', () => {
      const field = createFieldFromType(FieldType.RADIO, 'Gender') as any;

      expect(field.type).toBe(FieldType.RADIO);
      expect(field.options).toBeDefined();
      expect(field.options).toHaveLength(2);
      expect(field.options[0]).toHaveProperty('id');
      expect(field.options[0]).toHaveProperty('label');
      expect(field.options[0]).toHaveProperty('value');
    });

    it('should create a dropdown field with default options', () => {
      const field = createFieldFromType(FieldType.DROPDOWN, 'Country') as any;

      expect(field.type).toBe(FieldType.DROPDOWN);
      expect(field.options).toBeDefined();
      expect(field.options).toHaveLength(2);
    });

    /*
    it('should sanitize label to create valid field name', () => {
      const field1 = createFieldFromType(FieldType.TEXT, 'First Name') as InputField;
      expect(field1.name).toBe('first_name');

      const field2 = createFieldFromType(FieldType.TEXT, 'Contact   Phone   Number') as PhoneField;
      expect(field2.name).toBe('contact_phone_number');

      const field3 = createFieldFromType(FieldType.TEXT, 'Email') as EmailField;
      expect(field3.name).toBe('email');
    });
    */

    it('should generate unique option IDs for option-based fields', () => {
      const field = createFieldFromType(FieldType.CHECKBOX, 'Options') as any;

      expect(field.options[0].id).not.toBe(field.options[1].id);
      expect(field.options[0].id).toBeTruthy();
      expect(field.options[1].id).toBeTruthy();
    });

    it('should create number field without options', () => {
      const field = createFieldFromType(FieldType.NUMBER, 'Age') as any;

      expect(field.type).toBe(FieldType.NUMBER);
      expect(field.options).toBeUndefined();
    });

    it('should create phone field without options', () => {
      const field = createFieldFromType(FieldType.PHONE, 'Phone Number') as any;

      expect(field.type).toBe(FieldType.PHONE);
      expect(field.options).toBeUndefined();
    });

    it('should create date field without options', () => {
      const field = createFieldFromType(FieldType.DATE, 'Birth Date') as DateField;

      expect(field.type).toBe(FieldType.DATE);
    });
  });
});
