import { useState, useEffect } from "react";
import {
  getWords,
  addWord,
  updateWord,
  deleteWord,
  Word,
} from "@/shared/wordsApi";
import {
  saveOfflineWord,
  getOfflineWords,
  clearOfflineWords,
} from "@/shared/offlineWords";

export function useWords() {
  const [rows, setRows] = useState<Word[]>([]);
  const [draftRow, setDraftRow] = useState<{
    word: string;
    translation: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== "undefined" ? navigator.onLine : true
  );

  // Слежение за статусом сети
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Синхронизация офлайн-слов при появлении соединения
  useEffect(() => {
    const syncOffline = async () => {
      if (navigator.onLine) {
        const offlineWords = await getOfflineWords();
        if (offlineWords.length > 0) {
          for (const w of offlineWords) {
            try {
              await addWord(w.word, w.translation);
            } catch {}
          }
          await clearOfflineWords();
          // После синхронизации обновляем список из Supabase
          getWords().then(setRows);
        }
      }
    };
    syncOffline();
    window.addEventListener("online", syncOffline);
    return () => {
      window.removeEventListener("online", syncOffline);
    };
  }, []);

  // Загрузка слов при инициализации
  useEffect(() => {
    setLoading(true);
    if (navigator.onLine) {
      getWords()
        .then((data) => {
          setRows(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Ошибка загрузки слов");
          setLoading(false);
        });
    } else {
      getOfflineWords()
        .then((offline) => {
          setRows(
            offline.map((w, i) => ({
              id: `offline-${i}-${Date.now()}`,
              word: w.word,
              translation: w.translation,
            }))
          );
          setLoading(false);
        })
        .catch(() => {
          setError("Нет соединения и нет офлайн-слов");
          setLoading(false);
        });
    }
  }, []);

  // Автоматический сброс error через 3 секунды
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddRow = async () => {
    if (!draftRow) {
      setDraftRow({ word: "", translation: "" });
      return;
    }
    if (draftRow.word.trim() && draftRow.translation.trim()) {
      setLoading(true);
      try {
        const newWord = await addWord(
          draftRow.word.trim(),
          draftRow.translation.trim()
        );
        setRows((prev) => [...prev, newWord]);
        setDraftRow(null);
        setLoading(false);
      } catch {
        // Если нет сети — сохраняем офлайн
        await saveOfflineWord({
          word: draftRow.word.trim(),
          translation: draftRow.translation.trim(),
        });
        setRows((prev) => [
          ...prev,
          {
            id: `offline-${Date.now()}`,
            word: draftRow.word.trim(),
            translation: draftRow.translation.trim(),
          },
        ]);
        setDraftRow(null);
        setLoading(false);
        setError("Слово сохранено офлайн. Будет добавлено при появлении сети.");
      }
    }
  };

  const handleDraftChange = (field: "word" | "translation", value: string) => {
    if (!draftRow) return;
    setDraftRow({ ...draftRow, [field]: value });
  };

  const handleUpdateRow = async (
    id: string,
    word: string,
    translation: string
  ) => {
    setLoading(true);
    try {
      const updated = await updateWord(id, word, translation);
      setRows((prev) => prev.map((w) => (w.id === id ? updated : w)));
      setLoading(false);
    } catch {
      setError("Ошибка обновления слова");
      setLoading(false);
    }
  };

  const handleDeleteRow = async (id: string) => {
    setLoading(true);
    try {
      await deleteWord(id);
      setRows((prev) => prev.filter((w) => w.id !== id));
      setLoading(false);
    } catch {
      setError("Ошибка удаления слова");
      setLoading(false);
    }
  };

  return {
    rows,
    draftRow,
    handleAddRow,
    handleDraftChange,
    handleUpdateRow,
    handleDeleteRow,
    loading,
    error,
    isOnline,
  };
}
