import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../useHistory';

describe('useHistory', () => {
    it('should initialize with initial state', () => {
        const { result } = renderHook(() => useHistory(0));
        expect(result.current.state).toBe(0);
        expect(result.current.pointer).toBe(0);
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(false);
    });

    it('should update state and history', () => {
        const { result } = renderHook(() => useHistory(0));

        act(() => {
            result.current.set(1);
        });

        expect(result.current.state).toBe(1);
        expect(result.current.pointer).toBe(1);
        expect(result.current.history).toEqual([0, 1]);
        expect(result.current.canUndo).toBe(true);
    });

    it('should undo and redo', () => {
        const { result } = renderHook(() => useHistory(0));

        act(() => {
            result.current.set(1);
        });

        act(() => {
            result.current.undo();
        });

        expect(result.current.state).toBe(0);
        expect(result.current.pointer).toBe(0);
        expect(result.current.canRedo).toBe(true);

        act(() => {
            result.current.redo();
        });

        expect(result.current.state).toBe(1);
        expect(result.current.pointer).toBe(1);
    });

    it('should overwrite future on new set after undo', () => {
        const { result } = renderHook(() => useHistory('A'));

        act(() => { // Ptr 0, Hist ['A']
            result.current.set('B'); // Ptr 1, Hist ['A', 'B']
        });

        act(() => {
            result.current.undo(); // Ptr 0, Hist ['A', 'B']
        });

        act(() => {
            result.current.set('C'); // Should become ['A', 'C']
        });

        expect(result.current.state).toBe('C');
        expect(result.current.history).toEqual(['A', 'C']);
        expect(result.current.pointer).toBe(1);
        expect(result.current.canRedo).toBe(false);
    });

    it('should respect maxHistory', () => {
        const { result } = renderHook(() => useHistory(0, 2)); // Max 2 items

        act(() => {
            result.current.set(1); // [0, 1]
            result.current.set(2); // [1, 2] since max is 2
        });

        expect(result.current.history).toEqual([1, 2]);
        expect(result.current.state).toBe(2);
        expect(result.current.pointer).toBe(1); // 0-indexed, length 2 -> index 1

        // Let's verify we can undo to 1
        act(() => {
            result.current.undo();
        });

        expect(result.current.state).toBe(1);
    });
});
