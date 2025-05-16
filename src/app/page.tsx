"use client";
import Header from "@/app/main/Header";
import WordTable from "../entities/word/ui/WordTable";
import { useWords } from "@/features/words/model/useWords";

export default function Home() {
  const { handleAddRow } = useWords();
  return (
    <div className="flex flex-col gap-6">
      <Header addWord={handleAddRow} />
      <WordTable />
    </div>
  );
}
