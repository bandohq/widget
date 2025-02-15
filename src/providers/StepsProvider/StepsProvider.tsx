import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type StepType = "loading" | "info";

type Step = {
  message: string;
  type: StepType;
} | null;

type StepsContextType = {
  step: Step;
  showSteps: boolean;
  updateStep: (message: string, type?: StepType) => void;
  clearStep: () => void;
};

const StepsContext = createContext<StepsContextType | undefined>(undefined);

interface StepsProviderProps {
  children: ReactNode;
}

export function StepsProvider({ children }: StepsProviderProps) {
  const [showSteps, setShowSteps] = useState(false);
  const [step, setStep] = useState<Step>(null);

  const updateStep = useCallback((message: string, type: StepType) => {
    setShowSteps(true);
    setStep({ message, type });
  }, []);

  const clearStep = useCallback(() => {
    setShowSteps(false);
    setStep(null);
  }, []);

  return (
    <StepsContext.Provider value={{ step, showSteps, updateStep, clearStep }}>
      {children}
    </StepsContext.Provider>
  );
}

export function useSteps() {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error("useSteps must be used within a StepsProvider");
  }
  return context;
}
