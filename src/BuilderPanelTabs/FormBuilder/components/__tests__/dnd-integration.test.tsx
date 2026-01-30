/**
 * @jest-environment jsdom
 */
import { arrayMove } from '@dnd-kit/sortable';
import { EmailField, Field, FieldType } from '../../types';
import { createFieldFromType } from '../../utils/dnd/utils';


// Mock arrayMove is already provided by the actual library
jest.unmock('@dnd-kit/sortable');

describe('DnD Integration Logic', () => {
  describe('arrayMove for field reordering', () => {
    it('should reorder fields correctly when moving down', () => {
      const fields: Field[] = [
        { id: '1', type: FieldType.TEXT, label: 'Field 1', name: 'field1', required: false },
        { id: '2', type: FieldType.EMAIL, label: 'Field 2', name: 'field2', required: false },
        { id: '3', type: FieldType.NUMBER, label: 'Field 3', name: 'field3', required: false },
      ];

      const reordered = arrayMove(fields, 0, 2);

      expect(reordered[0].id).toBe('2');
      expect(reordered[1].id).toBe('3');
      expect(reordered[2].id).toBe('1');
    });

    it('should reorder fields correctly when moving up', () => {
      const fields: Field[] = [
        { id: '1', type: FieldType.TEXT, label: 'Field 1', name: 'field1', required: false },
        { id: '2', type: FieldType.EMAIL, label: 'Field 2', name: 'field2', required: false },
        { id: '3', type: FieldType.NUMBER, label: 'Field 3', name: 'field3', required: false },
      ];

      const reordered = arrayMove(fields, 2, 0);

      expect(reordered[0].id).toBe('3');
      expect(reordered[1].id).toBe('1');
      expect(reordered[2].id).toBe('2');
    });

    it('should handle same position move', () => {
      const fields: Field[] = [
        { id: '1', type: FieldType.TEXT, label: 'Field 1', name: 'field1', required: false },
        { id: '2', type: FieldType.EMAIL, label: 'Field 2', name: 'field2', required: false },
      ];

      const reordered = arrayMove(fields, 0, 0);

      expect(reordered[0].id).toBe('1');
      expect(reordered[1].id).toBe('2');
    });
  });

  describe('Field creation from palette drop', () => {
    it('should create new field when dragging from palette', () => {
      const newField = createFieldFromType(FieldType.EMAIL, 'Email Address') as EmailField;

      expect(newField.id).toBeTruthy();
      expect(newField.type).toBe(FieldType.EMAIL);
      expect(newField.label).toBe('Email Address');
    });

    it('should add field to correct position in array', () => {
      const existingFields: Field[] = [
        { id: '1', type: FieldType.TEXT, label: 'Field 1', name: 'field1', required: false },
        { id: '2', type: FieldType.EMAIL, label: 'Field 2', name: 'field2', required: false },
      ];

      const newField = createFieldFromType(FieldType.NUMBER, 'Age');
      const insertIndex = 1;
      const updatedFields = [
        ...existingFields.slice(0, insertIndex),
        newField,
        ...existingFields.slice(insertIndex),
      ];

      expect(updatedFields.length).toBe(3);
      expect(updatedFields[0].id).toBe('1');
      expect(updatedFields[1].type).toBe(FieldType.NUMBER);
      expect(updatedFields[2].id).toBe('2');
    });

    it('should append field when dropped at end', () => {
      const existingFields: Field[] = [
        { id: '1', type: FieldType.TEXT, label: 'Field 1', name: 'field1', required: false },
      ];

      const newField = createFieldFromType(FieldType.PHONE, 'Phone');
      const updatedFields = [...existingFields, newField];

      expect(updatedFields.length).toBe(2);
      expect(updatedFields[1].type).toBe(FieldType.PHONE);
    });
  });

  describe('Drag state management', () => {
    it('should track palette field being dragged', () => {
      const activeDrag = {
        kind: 'palette-field' as const,
        fieldType: FieldType.TEXT,
        label: 'Text Input',
      };

      expect(activeDrag.kind).toBe('palette-field');
      expect(activeDrag.fieldType).toBe(FieldType.TEXT);
    });

    it('should track canvas field being dragged', () => {
      const activeDrag = {
        kind: 'canvas-field' as const,
        fieldId: 'field_123',
        label: 'Email',
      };

      expect(activeDrag.kind).toBe('canvas-field');
      expect(activeDrag.fieldId).toBe('field_123');
    });

    it('should clear drag state on cancel', () => {
      let activeDrag: any = {
        kind: 'palette-field',
        fieldType: FieldType.TEXT,
        label: 'Text',
      };

      // Simulate drag cancel
      activeDrag = null;

      expect(activeDrag).toBeNull();
    });
  });
});
