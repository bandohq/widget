import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type StepType = "loading" | "info" | "completed";

export type Step = {
  message: string;
  type: StepType;
} | null;

type StepsContextType = {
  steps: Step[];
  addStep: (step: Step) => void;
  updateStep: (step: Step) => void;
  clearStep: () => void;
};

const StepsContext = createContext<StepsContextType | undefined>(undefined);

interface StepsProviderProps {
  children: ReactNode;
}

export function StepsProvider({ children }: StepsProviderProps) {
  const [steps, setSteps] = useState<Step[]>([]);

  const addStep = useCallback((step: Step) => {
    setSteps((prevSteps) => [...prevSteps, step]);
  }, []);

  const updateStep = useCallback((step: Step) => {
    setSteps((prevSteps) => {
      if (prevSteps.length === 0) return [step];
      return [...prevSteps.slice(0, -1), step];
    });
  }, []);

  const clearStep = useCallback(() => {
    setSteps([]);
  }, []);

  return (
    <StepsContext.Provider value={{ steps, addStep, updateStep, clearStep }}>
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
