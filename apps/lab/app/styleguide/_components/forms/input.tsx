import { cn } from "@cds/core";
import type { InputHTMLAttributes } from "react";
import { fieldControlClass } from "./field";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  specimenState?: "focus";
};

export function Input({ className, specimenState, ...props }: InputProps) {
  return (
    <input
      className={cn(fieldControlClass, className)}
      data-specimen={specimenState}
      {...props}
    />
  );
}
