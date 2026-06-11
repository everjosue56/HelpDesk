import React from 'react';

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  id,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 pl-11 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
};