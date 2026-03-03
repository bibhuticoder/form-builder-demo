import { useState, useCallback } from 'react';

interface HistoryState<T> {
    history: T[];
    pointer: number;
}

interface HistoryActions<T> {
    state: T;
    set: (newPresent: T | ((curr: T) => T)) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    history: T[];
    pointer: number;
}

/**
 * useHistory Hook
 * Manages state history with undo/redo functionality.
 *
 * @param initialPresent The initial state value
 * @param maxHistory Maximum number of history steps to keep (default 50)
 */
export function useHistory<T>(initialPresent: T, maxHistory: number = 50): HistoryActions<T> {
    const [historyState, setHistoryState] = useState<HistoryState<T>>({
        history: [initialPresent],
        pointer: 0
    });

    const { history, pointer } = historyState;

    const present = history[pointer];
    const canUndo = pointer > 0;
    const canRedo = pointer < history.length - 1;

    const undo = useCallback(() => {
        setHistoryState(prev => {
            if (prev.pointer > 0) {
                return {
                    ...prev,
                    pointer: prev.pointer - 1
                };
            }
            return prev;
        });
    }, []);

    const redo = useCallback(() => {
        setHistoryState(prev => {
            if (prev.pointer < prev.history.length - 1) {
                return {
                    ...prev,
                    pointer: prev.pointer + 1
                };
            }
            return prev;
        });
    }, []);

    const set = useCallback((val: T | ((curr: T) => T)) => {
        setHistoryState(prev => {
            const currentVal = prev.history[prev.pointer];
            const nextVal = typeof val === 'function' ? (val as (curr: T) => T)(currentVal) : val;

            if (nextVal === currentVal) {
                return prev;
            }

            const newHistory = prev.history.slice(0, prev.pointer + 1);
            newHistory.push(nextVal);

            if (newHistory.length > maxHistory) {
                newHistory.shift();
            }

            return {
                history: newHistory,
                pointer: newHistory.length - 1
            };
        });
    }, [maxHistory]);

    return {
        state: present,
        set,
        undo,
        redo,
        canUndo,
        canRedo,
        history,
        pointer
    };
}
