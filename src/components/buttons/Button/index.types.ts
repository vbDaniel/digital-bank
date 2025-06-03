import React, { ElementType } from "react";
import { CSSProperties, ReactNode } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  key?: React.Key | null | undefined;
  ref?: React.LegacyRef<HTMLButtonElement> | undefined;
  text?: string | ReactNode;
  customStyles?: CSSProperties;
  classStyle?: string;
  classStyleIcon?: string;
  classStyleProgress?: string;
  disabled?: boolean;
  variant?: "filled" | "outline" | "default";
  progress?: boolean;
  progressIcon?: boolean;
  type?: "submit" | "button" | "reset";
  "aria-label"?: string;
  "data-testid"?: string;
  children?: ReactNode;
  customRole?: string;
  icon?: ElementType;
}
