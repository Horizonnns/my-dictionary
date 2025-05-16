import { useState, useEffect } from "react";

export function useWords() {
  const [rows, setRows] = useState<
    {
      id: number;
      word: string;
      translation: string;
    }[]
  >([]);
  const [draftRow, setDraftRow] = useState<{
    word: string;
    translation: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка слов при инициализации
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/words")
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Ошибка загрузки слов");
        setLoading(false);
      });
  }, []);

  const handleAddRow = () => {
    if (!draftRow) {
      setDraftRow({ word: "", translation: "" });
      return;
    }
    if (draftRow.word.trim() && draftRow.translation.trim()) {
      setLoading(true);
      fetch("http://localhost:3001/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: draftRow.word.trim(),
          translation: draftRow.translation.trim(),
        }),
      })
        .then((res) => res.json())
        .then((newWord) => {
          setRows((prev) => [...prev, newWord]);
          setDraftRow(null);
          setLoading(false);
        })
        .catch(() => {
          setError("Ошибка добавления слова");
          setLoading(false);
        });
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
