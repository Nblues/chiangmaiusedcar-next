import * as React from "react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, onValueChange, onChange, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={`flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        ref={ref}
        onChange={(e) => {
          if (onChange) onChange(e);
          if (onValueChange) onValueChange(e.target.value);
        }}
        {...props}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  )
})
Select.displayName = "Select"

// Mock these so we don't have to change the page.tsx layout much
const SelectTrigger = ({ children, ...props }: any) => <>{children}</>;
const SelectValue = ({ placeholder, ...props }: any) => null;
const SelectContent = ({ children, ...props }: any) => <>{children}</>;
const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => <option value={value}>{children}</option>;

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
