import { forwardRef, InputHTMLAttributes } from "react";

const PREFIX = "+7 (";

function extractDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+7")) digits = digits.slice(1);
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function formatPhone(digits: string): string {
  if (!digits) return "";
  let out = `${PREFIX}${digits.slice(0, 3)}`;
  if (digits.length >= 3) out += ")";
  if (digits.length > 3) out += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) out += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) out += `-${digits.slice(8, 10)}`;
  return out;
}

export const PHONE_PATTERN = "\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}";

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, onFocus, onBlur, ...props }, ref) => (
    <input
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="+7 (___) ___-__-__"
      pattern={PHONE_PATTERN}
      title="Введите номер полностью: +7 (999) 123-45-67"
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        let digits = extractDigits(next);
        const prevDigits = extractDigits(value);
        if (next.length < value.length && digits === prevDigits) digits = digits.slice(0, -1);
        onChange(digits ? formatPhone(digits) : next.length < value.length ? "" : PREFIX);
      }}
      onFocus={(e) => {
        if (!value) onChange(PREFIX);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        if (value === PREFIX) onChange("");
        onBlur?.(e);
      }}
      {...props}
    />
  )
);
PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
