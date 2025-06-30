import React, { useState, useRef, useEffect } from "react";

export interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onPaste?: (value: string) => void;
}

export const OtpInput = ({
  length = 6,
  value = "",
  onChange,
  onPaste,
}: OtpInputProps) => {
  const [otp, setOtp] = useState(
    value.split("").concat(new Array(length).fill("")).slice(0, length),
  );
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    setOtp(value.split("").concat(new Array(length).fill("")).slice(0, length));
  }, [value, length]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [length]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (inputValue: string, index: number) => {
    if (/^[0-9]?$/.test(inputValue)) {
      const newOtp = [...otp];
      newOtp[index] = inputValue;
      setOtp(newOtp);
      const newValue = newOtp.join("");
      onChange?.(newValue);

      if (inputValue && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: any, index: number) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length - index);

    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        if (index + i < length) {
          newOtp[index + i] = pasteData[i];
        }
      }
      setOtp(newOtp);
      const newValue = newOtp.join("");

      onChange?.(newValue);
      const nextIndex = Math.min(index + pasteData.length, length - 1);

      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }

      if (newValue.length === length && typeof onPaste === "function") {
        onPaste(newValue);
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          ref={(el) => (inputRefs.current[index] = el as any)}
          className="w-14 h-14 text-center text-lg font-extrabold border
            border-gray-300 rounded-md focus:border-brand-100 focus:ring-2
            focus:ring-brand-200 outline-none transition-all"
          //           aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
