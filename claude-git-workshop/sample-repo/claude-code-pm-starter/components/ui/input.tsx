// components/ui/input.tsx
import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-ink-700">{label}</label>}
        <input
          ref={ref}
          className={`px-3 py-2 border border-ink-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
