import React from 'react';
import { cn } from "@/lib/utils";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {children}
      </select>
    </div>
  );
};

const SelectTrigger = ({ className, children }: SelectTriggerProps) => {
  return <div className={cn("", className)}>{children}</div>;
};

const SelectContent = ({ children }: SelectContentProps) => {
  return <>{children}</>;
};

const SelectItem = ({ value, children }: SelectItemProps) => {
  return <option value={value}>{children}</option>;
};

const SelectValue = ({ placeholder }: SelectValueProps) => {
  return <option value="" disabled>{placeholder}</option>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };