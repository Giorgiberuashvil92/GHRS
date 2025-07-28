import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { verifyCode } from "@/app/config/api";

interface VerificationStepProps {
  onNext: () => void;
  onBack: () => void;
  onVerificationComplete: (code: string) => void;
  email: string;
}

const CODE_LENGTH = 6;

const VerificationStep: React.FC<VerificationStepProps> = ({
  onNext,
  onBack,
  onVerificationComplete,
  email,
}) => {
  const [values, setValues] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (timer > 0 && !disabled) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setDisabled(true);
      setError("Время действия кода истекло. Пожалуйста, запросите новый код.");
    }
  }, [timer, disabled]);

  const handleChange = (idx: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;
    const newValues = [...values];
    newValues[idx] = val;
    setValues(newValues);
    if (val && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown =
    (idx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !values[idx] && idx > 0) {
        const newValues = [...values];
        newValues[idx - 1] = "";
        setValues(newValues);
        inputsRef.current[idx - 1]?.focus();
      }
    };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (paste.length === CODE_LENGTH) {
      setValues(paste.split(""));
      setTimeout(() => {
        inputsRef.current[CODE_LENGTH - 1]?.focus();
      }, 0);
    }
  };

  const allFilled = values.every((v) => v.length === 1);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (allFilled && !isLoading) {
      setIsLoading(true);
      setError("");

      try {
        const code = values.join("");
        await verifyCode(email, code);
        onVerificationComplete(code);
        onNext();
      } catch (error: unknown) {
        console.error("Verification failed:", error);
        setError("Неверный код. Пожалуйста, попробуйте снова.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto">
      <h2 className="text-[32px] leading-[100%] tracking-[-3%] font-bold mb-2 text-[#3D334A] ">
        Верификация аккаунта
      </h2>
      <p className="mb-10 mt-2 text-[#846FA0] text-start pl-12 text-[18px] font-medium leading-[100%] font-[Pt]">
        Для подтверждения аккаунта введите код, отправленный на ваш email{" "}
        {email}
      </p>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 w-full justify-center"
      >
        <div className="flex items-center justify-center px-10 w-full gap-[20px] mb-2">
          {values.map((val, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className="text-center text-2xl border rounded-lg focus:border-[#D4BAFC] w-[70px] h-[70px] border-[#D4BAFC] focus:outline-none bg-white text-[#3D334A] tracking-widest"
              value={val}
              onChange={handleChange(idx)}
              onKeyDown={handleKeyDown(idx)}
              onPaste={handlePaste}
              disabled={disabled || isLoading}
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <div className="text-[#846FA0] mt-5 text-[18px] leading-[100%] pl-10 font-bold font-[Pt]">
          Повторная отправка кода возможна через:{" "}
          <span className="text-[#D4BAFC]">{timer}</span> секунд
        </div>
        {error && (
          <span className="text-red-500 text-sm text-center">{error}</span>
        )}
        <div className="flex justify-between mt-8 gap-4 px-10 font-[Pt]">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#E9DFF6] text-[#3D334A] py-2 px-8 rounded-lg font-medium text-[18px]"
            disabled={isLoading}
          >
            Назад
          </button>
          <button
            type="submit"
            className="bg-[#D4BAFC] text-white py-2 px-8 rounded-lg font-medium text-[18px] disabled:opacity-50"
            disabled={!allFilled || disabled || isLoading}
          >
            {isLoading ? "Пожалуйста, подождите..." : "Далее"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerificationStep;
