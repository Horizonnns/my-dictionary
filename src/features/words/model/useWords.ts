import { useState, useEffect } from "react";
import { getWords, addWord, Word } from "@/shared/wordsApi";

export function useWords() {
  const [rows, setRows] = useState<Word[]>([]);
  const [draftRow, setDraftRow] = useState<{
    word: string;
    translation: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка слов при инициализации
  useEffect(() => {
    setLoading(true);
    getWords()
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки слов");
        setLoading(false);
      });
  }, []);

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
        setError("Ошибка добавления слова");
        setLoading(false);
      }
    }
  };

  const handleDraftChange = (field: "word" | "translation", value: string) => {
    if (!draftRow) return;
    setDraftRow({ ...draftRow, [field]: value });
  };

  return {
    rows,
    draftRow,
    handleAddRow,
    handleDraftChange,
    loading,
    error,
  };
}
