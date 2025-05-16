import { useState } from "react";

export function useWords() {
  const [rows, setRows] = useState([
    {
      id: 1,
      word: "Hello",
      translation: "Привет",
    },
  ]);

  const [draftRow, setDraftRow] = useState<{
    word: string;
    translation: string;
  } | null>(null);

  const handleAddRow = () => {
    if (!draftRow) {
      setDraftRow({ word: "", translation: "" });
      return;
    }
    if (draftRow.word.trim() && draftRow.translation.trim()) {
      setRows([
        ...rows,
        {
          id: rows.length + 1,
          word: draftRow.word.trim(),
          translation: draftRow.translation.trim(),
        },
      ]);
      setDraftRow(null);
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
  };
}
