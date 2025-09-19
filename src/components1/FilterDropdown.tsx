import React, { useState } from 'react';
import { Button } from '@/components1/ui/button';
import { Checkbox } from '@/components1/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components1/ui/popover';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  onOptionChange: (optionId: string, checked: boolean) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  onOptionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 border-gray-300 hover:border-gray-400 min-w-max"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate max-w-[120px]">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] max-w-[280px] py-2">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={(e) => onOptionChange(option.id, e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span 
                    className="text-sm text-gray-700 group-hover:text-gray-900 break-words leading-tight"
                    title={option.label} // Show full text on hover
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;