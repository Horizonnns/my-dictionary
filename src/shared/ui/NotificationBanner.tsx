import React, { useEffect, useRef, useState } from "react";

interface NotificationBannerProps {
  isOnline: boolean;
  error: string | null;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  isOnline,
  error,
}) => {
  const [visible, setVisible] = useState(!isOnline);
  const lastStatus = useRef(isOnline);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (lastStatus.current !== isOnline) {
      setVisible(true);
      lastStatus.current = isOnline;
    }
  }, [isOnline]);

  useEffect(() => {
    if (visible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  return (
    <div
      className={`
        fixed left-0 top-0 z-50 text-center px-4 py-2 rounded-b-md transition-transform text-white duration-300        ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }
        shadow-lg
        ${visible ? "translate-y-0" : "-translate-y-20"}
      `}
      style={{ minWidth: 220 }}
    >
      {isOnline ? "Соединение восстановлено" : "Обрыв соединения..."}
      {error && <span className="text-xs">{error}</span>}
    </div>
  );
};

export default NotificationBanner;
