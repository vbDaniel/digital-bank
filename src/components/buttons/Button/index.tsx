import { CircularProgress } from "@mui/material";
import React from "react";

import styles from "./index.module.css";
import { ButtonProps } from "./index.types";

const Button = ({
  ref,
  text,
  customStyles,
  classStyle,
  classStyleIcon,
  classStyleProgress,
  disabled,
  variant,
  type,
  progress,
  progressIcon,
  "aria-label": ariaLabel,
  "data-testid": dataTestid,
  children,
  customRole,
  icon: Icon,
  ...props
}: ButtonProps) => {
  const className =
    variant === "filled"
      ? styles.btnFilled
      : variant === "outline"
      ? styles.btnOutline
      : styles.btnDefault;

  return (
    <button
      ref={ref}
      type={type}
      className={`${className} ${classStyle}`}
      style={{ width: "100%", ...customStyles }}
      disabled={disabled || progress}
      aria-label={ariaLabel}
      data-testid={dataTestid}
      role={customRole}
      {...props}
    >
      {progress ? (
        <CircularProgress
          size={22}
          data-testid="circularProgress"
          className={classStyleProgress}
        />
      ) : (
        <>
          {progressIcon ? (
            <CircularProgress
              size={22}
              data-testid="circularProgress"
              className={classStyleProgress}
            />
          ) : (
            Icon && <Icon className={`${styles.icon} ${classStyleIcon}`} />
          )}
          {text && <p className={styles.text}>{text}</p>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
