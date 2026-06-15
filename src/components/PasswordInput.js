import React, { useState } from 'react';

function PasswordInput({ value, onChange, placeholder, className, required }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        required={required}
      />
      <span 
        className="password-eye"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#999" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="2"/>
            <path d="M3 3L21 21" stroke="#999" strokeWidth="2"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#999" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="2"/>
          </svg>
        )}
      </span>
    </div>
  );
}

export default PasswordInput;