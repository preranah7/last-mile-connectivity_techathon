// src/components/common/Input.jsx

import { useState } from 'react';
import { clsx } from 'clsx';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder = ' ',
  error,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={clsx('relative', className)}>
      {/* Input field */}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-uber-dark-gray">
            <Icon size={20} />
          </div>
        )}
        
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={clsx(
            'w-full px-4 py-4 rounded-uber text-base transition-all',
            'bg-uber-light-gray border-2',
            Icon && 'pl-12',
            type === 'password' && 'pr-12',
            
            // Focus states
            isFocused && !error && 'border-uber-black bg-white',
            !isFocused && !error && 'border-transparent',
            
            // Error state
            error && 'border-red-500 bg-red-50',
            
            // Disabled state
            disabled && 'opacity-50 cursor-not-allowed',
            
            // Focus outline
            'focus:outline-none'
          )}
          {...props}
        />

        {/* Floating label */}
        {label && (
          <label
            className={clsx(
              'absolute left-4 transition-all duration-200 pointer-events-none',
              Icon && 'left-12',
              
              // Floating state
              shouldFloat
                ? 'top-1 text-xs text-uber-dark-gray'
                : 'top-1/2 -translate-y-1/2 text-base text-uber-dark-gray',
              
              // Error state
              error && shouldFloat && 'text-red-500'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-uber-dark-gray hover:text-uber-black"
            tabIndex={-1}
          >
            {showPassword ? (
              <FaRegEye size={20} />
            ) : (
              <FaRegEyeSlash size={20} />
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-start gap-1">
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Simple eye icons (to avoid external dependencies)
 */
// const EyeIcon = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const EyeOffIcon = ({ size = 20 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
//     <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

/**
 * Phone Input (with country code)
 */
export const PhoneInput = ({
  label = 'Phone Number',
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="w-20">
          <input
            type="text"
            value="+91"
            disabled
            className="w-full px-4 py-4 rounded-uber text-base bg-uber-gray border-2 border-transparent text-center font-medium"
          />
        </div>
        <div className="flex-1">
          <Input
            type="tel"
            label={label}
            value={value}
            onChange={onChange}
            error={error}
            maxLength={10}
            //placeholder="9876543210"
            {...props}
          />
        </div>
      </div>
    </div>
  );
};

