import React, { useEffect, useRef, useState } from "react";

interface NotificationBannerProps {
  isOnline: boolean;
  error: string | null;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  isOnline,
  error,
}) => {
  const [visible, setVisible] = useState(false);
  const lastStatus = useRef(isOnline);
  const lastError = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Показывать баннер при смене статуса сети или появлении нового error
  useEffect(() => {
    if (lastStatus.current !== isOnline || lastError.current !== error) {
      setVisible(true);
      lastStatus.current = isOnline;
      lastError.current = error;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 4000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOnline, error]);

  return (
    <div
      className={`
        fixed left-0 top-0 z-50 text-center px-4 py-2 rounded-b-md transition-transform text-white duration-300 select-none
        ${isOnline ? "bg-green-500" : "bg-red-500"}
        shadow-lg
        ${visible ? "translate-y-0" : "-translate-y-20"}
      `}
      style={{ minWidth: 220 }}
    >
      {isOnline ? "Соединение восстановлено" : "Обрыв соединения..."}
      {error && <span className="block text-xs mt-1">{error}</span>}
    </div>
  );
};

export default NotificationBanner;
