import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', href, className = '', children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-sm font-heading font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black";
  
  const variants = {
    primary: "bg-brand-green text-brand-black hover:bg-white hover:shadow-[0_0_20px_rgba(107,191,89,0.5)]",
    secondary: "bg-white text-brand-black hover:bg-brand-gray",
    outline: "border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-black"
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;