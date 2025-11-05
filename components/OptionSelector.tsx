
import React from 'react';
import { Option } from '../types';

interface OptionSelectorProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ label, options, selectedValue, onChange, name }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <div key={option.id}>
            <input
              type="radio"
              id={option.id}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <label
              htmlFor={option.id}
              className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out ${
                selectedValue === option.value
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;
