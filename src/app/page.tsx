"use client";
import Header from "@/app/main/Header";
import WordTable from "../entities/word/ui/WordTable";
import { useWords } from "@/features/words/model/useWords";
import { useEffect, useRef } from "react";
import NotificationBanner from "@/shared/ui/NotificationBanner";

export default function Home() {
  const words = useWords();
  const prevOnline = useRef(words.isOnline);

  useEffect(() => {
    if (prevOnline.current !== words.isOnline) {
      prevOnline.current = words.isOnline;
    }
  }, [words.isOnline]);

  return (
    <div className="shadow-md rounded-md overflow-hidden">
      <Header
        addWord={words.handleAddRow}
        searchQuery={words.searchQuery}
        setSearchQuery={words.setSearchQuery}
      />

      <WordTable
        cancelAdd={words.handleCancelAdd}
        rows={words.rows}
        draftRow={words.draftRow}
        handleAddRow={words.handleAddRow}
        handleDraftChange={words.handleDraftChange}
        handleUpdateRow={words.handleUpdateRow}
        handleDeleteRow={words.handleDeleteRow}
        loading={words.loading}
        error={words.error}
      />

      <NotificationBanner isOnline={words.isOnline} error={words.error} />
    </div>
  );
}
