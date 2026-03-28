import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, value, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10)
      if (onValueChange) onValueChange(val)
    }

    // Calculate percentage for gradient background
    const percentage = ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100

    return (
      <div className="relative w-full h-4 flex items-center group">
        <style>
          {`
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 14px;
              height: 14px;
              background: #ffffff;
              border: 2px solid #525df8;
              border-radius: 50%;
              cursor: pointer;
              margin-top: -5px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              transition: all 0.1s ease;
            }
            input[type='range']::-moz-range-thumb {
              width: 14px;
              height: 14px;
              background: #ffffff;
              border: 2px solid #525df8;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            input[type='range']::-webkit-slider-runnable-track {
              height: 4px;
              border-radius: 2px;
            }
            input[type='range']::-moz-range-track {
              height: 4px;
              border-radius: 2px;
            }
          `}
        </style>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer",
            "focus:outline-none focus:ring-0",
            className
          )}
          style={{
            background: `linear-gradient(to right, #525df8 ${percentage}%, #e2e8f0 ${percentage}%)`,
          } as React.CSSProperties}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
