/**
 * @jest-environment jsdom
 */
import { arrayMove } from '@dnd-kit/sortable';
import { FieldType } from '../../../../types';
import { createFieldFromType } from '../../utils/dnd/utils';

// Mock arrayMove if not available
jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: jest.fn((array: any[], from: number, to: number) => {
    const newArray = [...array];
    const [item] = newArray.splice(from, 1);
    newArray.splice(to, 0, item);
    return newArray;
  }),
}));

describe('Drag Handler Logic', () => {
  describe('Field Creation from Palette', () => {
    it('should create a new field when dragging from palette', () => {
      const newField = createFieldFromType(FieldType.TEXT, 'Email');

      expect(newField).toMatchObject({
        type: FieldType.TEXT,
        label: 'Email',
        name: 'email',
        required: false,
      });
      expect(newField.id).toBeTruthy();
    });

    it('should add field to empty fields array', () => {
      const fields: any[] = [];
      const newField = createFieldFromType(FieldType.EMAIL, 'Contact Email');

      const updatedFields = [...fields, newField];

      expect(updatedFields).toHaveLength(1);
      expect(updatedFields[0].type).toBe(FieldType.EMAIL);
    });

    it('should add field to existing fields array', () => {
      const fields = [
        { id: '1', type: FieldType.TEXT, label: 'Name', name: 'name' },
        { id: '2', type: FieldType.EMAIL, label: 'Email', name: 'email' },
      ];
      const newField = createFieldFromType(FieldType.PHONE, 'Phone');

      const updatedFields = [...fields, newField];

      expect(updatedFields).toHaveLength(3);
      expect(updatedFields[2].type).toBe(FieldType.PHONE);
    });
  });

  describe('Field Reordering', () => {
    it('should reorder fields using arrayMove', () => {
      const fields = [
        { id: '1', type: FieldType.TEXT, label: 'Name', name: 'name' },
        { id: '2', type: FieldType.EMAIL, label: 'Email', name: 'email' },
        { id: '3', type: FieldType.PHONE, label: 'Phone', name: 'phone' },
      ];

      const reordered = arrayMove(fields, 0, 2);

      expect(reordered[0].id).toBe('2');
      expect(reordered[1].id).toBe('3');
      expect(reordered[2].id).toBe('1');
    });

    it('should move field from bottom to top', () => {
      const fields = [
        { id: 'a', label: 'First' },
        { id: 'b', label: 'Second' },
        { id: 'c', label: 'Third' },
      ];

      const reordered = arrayMove(fields, 2, 0);

      expect(reordered[0].id).toBe('c');
      expect(reordered[1].id).toBe('a');
      expect(reordered[2].id).toBe('b');
    });

    it('should move field from top to bottom', () => {
      const fields = [
        { id: 'a', label: 'First' },
        { id: 'b', label: 'Second' },
        { id: 'c', label: 'Third' },
      ];

      const reordered = arrayMove(fields, 0, 2);

      expect(reordered[0].id).toBe('b');
      expect(reordered[1].id).toBe('c');
      expect(reordered[2].id).toBe('a');
    });

    it('should handle middle position moves', () => {
      const fields = [
        { id: '1', label: 'A' },
        { id: '2', label: 'B' },
        { id: '3', label: 'C' },
        { id: '4', label: 'D' },
      ];

      const reordered = arrayMove(fields, 1, 2);

      expect(reordered.map(f => f.id)).toEqual(['1', '3', '2', '4']);
    });
  });

  describe('Field Deletion', () => {
    it('should remove field by id', () => {
      const fields = [
        { id: '1', type: FieldType.TEXT, label: 'Name', name: 'name' },
        { id: '2', type: FieldType.EMAIL, label: 'Email', name: 'email' },
        { id: '3', type: FieldType.PHONE, label: 'Phone', name: 'phone' },
      ];

      const updatedFields = fields.filter(f => f.id !== '2');

      expect(updatedFields).toHaveLength(2);
      expect(updatedFields.find(f => f.id === '2')).toBeUndefined();
      expect(updatedFields[0].id).toBe('1');
      expect(updatedFields[1].id).toBe('3');
    });

    it('should handle deleting first field', () => {
      const fields = [
        { id: 'a', label: 'First' },
        { id: 'b', label: 'Second' },
      ];

      const updated = fields.filter(f => f.id !== 'a');

      expect(updated).toHaveLength(1);
      expect(updated[0].id).toBe('b');
    });

    it('should handle deleting last field', () => {
      const fields = [
        { id: 'a', label: 'First' },
        { id: 'b', label: 'Second' },
      ];

      const updated = fields.filter(f => f.id !== 'b');

      expect(updated).toHaveLength(1);
      expect(updated[0].id).toBe('a');
    });
  });
});
