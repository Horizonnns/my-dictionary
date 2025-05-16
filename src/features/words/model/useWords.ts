import { useState, useEffect, useRef } from "react";
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
  saveOfflineEditWord,
  getOfflineEdits,
  clearOfflineEdits,
  saveOfflineDeleteWord,
  getOfflineDeletes,
  clearOfflineDeletes,
  saveWordsToIndexedDB,
  removeOfflineWordById,
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
  const isSyncingRef = useRef(false);

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

  // Синхронизация офлайн-операций при появлении соединения
  useEffect(() => {
    const syncOffline = async () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      if (navigator.onLine) {
        // 1. Синхронизация добавленных слов
        const offlineWords = await getOfflineWords();
        for (const w of offlineWords) {
          if (typeof w.id === "string" && w.id.startsWith("offline-")) {
            try {
              await addWord(w.word, w.translation);
              await removeOfflineWordById(w.id); // удаляем только успешно добавленные
            } catch {}
          }
        }
        // 2. Синхронизация редактированных слов
        const offlineEdits = await getOfflineEdits();
        for (const e of offlineEdits) {
          try {
            await updateWord(e.id, e.word, e.translation);
          } catch {}
        }
        await clearOfflineEdits();
        // 3. Синхронизация удалённых слов
        const offlineDeletes = await getOfflineDeletes();
        for (const d of offlineDeletes) {
          try {
            await deleteWord(d.id);
          } catch {}
        }
        await clearOfflineDeletes();
        // 4. После синхронизации обновляем список из Supabase и IndexedDB
        const fresh = await getWords();
        setRows(fresh);
        await saveWordsToIndexedDB(fresh);
      }
      isSyncingRef.current = false;
    };
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
        .then(async (data) => {
          setRows(data);
          setLoading(false);
          await saveWordsToIndexedDB(data);
        })
        .catch(() => {
          setError("Ошибка загрузки слов");
          setLoading(false);
        });
    } else {
      getOfflineWords()
        .then((offline) => {
          setRows(
            offline.map((w: any) => ({
              id: w.id,
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
        await saveWordsToIndexedDB([...rows, newWord]);
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
    if (navigator.onLine) {
      try {
        const updated = await updateWord(id, word, translation);
        setRows((prev) => prev.map((w) => (w.id === id ? updated : w)));
        setLoading(false);
        await saveWordsToIndexedDB(
          rows.map((w) => (w.id === id ? { ...w, word, translation } : w))
        );
      } catch {
        setError("Ошибка обновления слова");
        setLoading(false);
      }
    } else {
      // offline: сохраняем в edits и обновляем локально
      await saveOfflineEditWord(id, word, translation);
      setRows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, word, translation } : w))
      );
      setLoading(false);
      setError(
        "Изменение сохранено офлайн. Будет применено при появлении сети."
      );
    }
  };

  const handleDeleteRow = async (id: string) => {
    setLoading(true);
    if (navigator.onLine) {
      try {
        await deleteWord(id);
        setRows((prev) => prev.filter((w) => w.id !== id));
        setLoading(false);
        await saveWordsToIndexedDB(rows.filter((w) => w.id !== id));
      } catch {
        setError("Ошибка удаления слова");
        setLoading(false);
      }
    } else {
      // offline: сохраняем в deletes и обновляем локально
      await saveOfflineDeleteWord(id);
      setRows((prev) => prev.filter((w) => w.id !== id));
      setLoading(false);
      setError(
        "Удаление сохранено офлайн. Будет применено при появлении сети."
      );
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
