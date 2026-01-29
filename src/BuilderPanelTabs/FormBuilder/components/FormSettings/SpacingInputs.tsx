import React, { useState, useCallback, useMemo } from "react";
import { LinkIcon, LinkSlashIcon } from "@heroicons/react/24/outline";

interface SpacingValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface SpacingInputsProps {
  label: string;
  values: SpacingValues;
  onChange: (key: "top" | "right" | "bottom" | "left", value: number) => void;
}

/**
 * SpacingInputs Component
 *
 * A reusable component for spacing inputs (margin/padding/border-radius).
 * Displays 4 inputs for Top, Right, Bottom, Left values.
 * Supports linked mode where all values change together.
 *
 * Performance Features:
 * - useCallback for memoized handlers to prevent unnecessary re-renders
 * - useMemo for computed state to optimize linked value detection
 * - Batch updates in linked mode for efficiency
 *
 * @example
 * <SpacingInputs
 *   label="Form Margin"
 *   values={{ top: 0, right: 0, bottom: 0, left: 0 }}
 *   onChange={(key, value) => handleChange(key, value)}
 * />
 */
export const SpacingInputs: React.FC<SpacingInputsProps> = ({
  label,
  values,
  onChange,
}) => {
  // Track if values are linked (changing one changes all)
  const [isLinked, setIsLinked] = useState(false);

  /**
   * Check if all spacing values are equal (auto-detect linked state)
   * Memoized to avoid recalculating on every render
   */
  const allValuesEqual = useMemo(
    () =>
      values.top === values.right &&
      values.right === values.bottom &&
      values.bottom === values.left,
    [values.top, values.right, values.bottom, values.left]
  );

  /**
   * Handle input change with batched updates in linked mode
   * Memoized to prevent child component re-renders
   */
  const handleInputChange = useCallback(
    (key: "top" | "right" | "bottom" | "left", value: number) => {
      if (isLinked) {
        // Batch update: when linked, update all values simultaneously
        onChange("top", value);
        onChange("right", value);
        onChange("bottom", value);
        onChange("left", value);
      } else {
        // Single update: only change the specific key
        onChange(key, value);
      }
    },
    [isLinked, onChange]
  );

  /**
   * Toggle linked state with batch initialization
   * Memoized to prevent unnecessary function recreations
   */
  const toggleLinked = useCallback(() => {
    setIsLinked((prevLinked) => {
      const nextLinked = !prevLinked;
      // When linking, batch set all values to equal the top value
      if (nextLinked && !allValuesEqual) {
        const equalValue = values.top;
        onChange("top", equalValue);
        onChange("right", equalValue);
        onChange("bottom", equalValue);
        onChange("left", equalValue);
      }
      return nextLinked;
    });
  }, [allValuesEqual, values.top, onChange]);

  return (
    <div className="space-y-3">
      {/* Label with Link/Unlink Button */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>

        {/* Link/Unlink Toggle Button */}
        <button
          onClick={toggleLinked}
          className={`p-1.5 rounded transition-colors ${
            isLinked
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
          title={isLinked ? "Unlink values" : "Link values"}
          aria-label={isLinked ? "Unlink spacing values" : "Link spacing values"}
        >
          {isLinked ? (
            <LinkIcon className="w-4 h-4" />
          ) : (
            <LinkSlashIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Spacing Input Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Top */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 w-6">
            T
          </span>
          <input
            type="number"
            value={values.top}
            onChange={(e) =>
              handleInputChange("top", Number(e.target.value))
            }
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 w-6">
            R
          </span>
          <input
            type="number"
            value={values.right}
            onChange={(e) =>
              handleInputChange("right", Number(e.target.value))
            }
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>

        {/* Bottom */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 w-6">
            B
          </span>
          <input
            type="number"
            value={values.bottom}
            onChange={(e) =>
              handleInputChange("bottom", Number(e.target.value))
            }
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>

        {/* Left */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 w-6">
            L
          </span>
          <input
            type="number"
            value={values.left}
            onChange={(e) =>
              handleInputChange("left", Number(e.target.value))
            }
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
      </div>

    </div>
  );
};
