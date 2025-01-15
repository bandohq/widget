import React, { createContext, useContext, useState, useCallback } from "react";

interface Notification {
  type: "success" | "error" | "warning";
  message: string;
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (
    type: "success" | "error" | "warning",
    message: string
  ) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback(
    (type: "success" | "error" | "warning", message: string) => {
      setNotification({ type, message });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const value = {
    notification,
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};
