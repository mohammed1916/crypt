import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, containerClassName = "", className = "", ...props }, ref) => (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && <label className="mb-1 text-xs text-muted-foreground">{label}</label>}
      <input
        ref={ref}
        className={`input input-bordered p-[2px] ${className}`}
        {...props}
      />
    </div>
  )
);
FormInput.displayName = "FormInput";

export default FormInput;
