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

        act(() => {
            result.current.set('B');
        });

        act(() => {
            result.current.undo();
        });

        act(() => {
            result.current.set('C');
        });

        expect(result.current.state).toBe('C');
        expect(result.current.history).toEqual(['A', 'C']);
        expect(result.current.pointer).toBe(1);
        expect(result.current.canRedo).toBe(false);
    });

    it('should respect maxHistory', () => {
        const { result } = renderHook(() => useHistory(0, 2));

        act(() => {
            result.current.set(1);
            result.current.set(2);
        });

        expect(result.current.history).toEqual([1, 2]);
        expect(result.current.state).toBe(2);
        expect(result.current.pointer).toBe(1);

        act(() => {
            result.current.undo();
        });

        expect(result.current.state).toBe(1);
    });

    it('should not add to history if value is unchanged', () => {
        const { result } = renderHook(() => useHistory('same'));

        act(() => {
            result.current.set('same');
        });

        expect(result.current.history).toEqual(['same']);
        expect(result.current.pointer).toBe(0);
    });

    it('should support functional updates', () => {
        const { result } = renderHook(() => useHistory(10));

        act(() => {
            result.current.set((curr) => curr + 5);
        });

        expect(result.current.state).toBe(15);
    });

    it('should not undo past beginning', () => {
        const { result } = renderHook(() => useHistory(0));

        act(() => {
            result.current.undo();
        });

        expect(result.current.state).toBe(0);
        expect(result.current.pointer).toBe(0);
    });

    it('should not redo past end', () => {
        const { result } = renderHook(() => useHistory(0));

        act(() => {
            result.current.redo();
        });

        expect(result.current.state).toBe(0);
        expect(result.current.pointer).toBe(0);
    });
});
