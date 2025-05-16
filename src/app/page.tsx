"use client";
import Header from "@/app/main/Header";
import WordTable from "../entities/word/ui/WordTable";
import { useWords } from "@/features/words/model/useWords";

export default function Home() {
  const words = useWords();
  return (
    <div className="flex flex-col gap-6">
      <Header addWord={words.handleAddRow} />
      <WordTable
        rows={words.rows}
        draftRow={words.draftRow}
        handleAddRow={words.handleAddRow}
        handleDraftChange={words.handleDraftChange}
        loading={words.loading}
        error={words.error}
      />
    </div>
  );
}
