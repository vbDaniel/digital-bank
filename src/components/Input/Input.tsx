import React from "react";
import styles from "./Input.module.css";
import { formatCPF, formatTelefone } from "utils/format";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  mask?: "cpf" | "telefone";
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      value,
      onChange,
      required = false,
      type = "text",
      title,
      mask,
      error,
      ...rest
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      if (mask === "cpf") {
        newValue = newValue.replace(/\D/g, "");
        newValue = formatCPF(newValue);
      } else if (mask === "telefone") {
        newValue = newValue.replace(/\D/g, "");
        newValue = formatTelefone(newValue);
      }

      // Cria um novo evento sintético com o valor mascarado
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: newValue,
        },
      };

      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className={styles.inputGroup}>
        <label htmlFor={name}>{label}</label>
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          required={required}
          title={title}
          maxLength={mask === "cpf" ? 14 : mask === "telefone" ? 15 : undefined}
          placeholder={
            mask === "cpf"
              ? "000.000.000-00"
              : mask === "telefone"
              ? "(00) 00000-0000"
              : ""
          }
          {...rest}
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
