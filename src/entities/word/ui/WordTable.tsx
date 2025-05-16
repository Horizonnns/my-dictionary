import { Table, Input, Button, Tag } from "antd";
import React from "react";
import type { Word } from "@/shared/wordsApi";

interface WordTableProps {
  rows: Word[];
  draftRow: { word: string; translation: string } | null;
  handleAddRow: () => void;
  handleDraftChange: (field: "word" | "translation", value: string) => void;
  loading: boolean;
}

const WordTable: React.FC<WordTableProps> = ({
  rows,
  draftRow,
  handleAddRow,
  handleDraftChange,
  loading,
}) => {
  const columns = [
    {
      title: "№",
      key: "index",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Слово",
      dataIndex: "word",
      key: "word",
      render: (value: React.ReactNode) =>
        typeof value === "string" ? <Tag color="blue">{value}</Tag> : value,
    },
    {
      title: "Перевод",
      dataIndex: "translation",
      key: "translation",
      render: (value: React.ReactNode) =>
        typeof value === "string" ? <Tag color="green">{value}</Tag> : value,
    },
  ];

  const dataSource = draftRow
    ? [
        ...rows,
        {
          id: "draft",
          word: (
            <Input
              value={draftRow.word}
              onChange={(e) => handleDraftChange("word", e.target.value)}
              placeholder="Word"
              size="small"
              className="!rounded-md !w-28"
            />
          ),
          translation: (
            <Input
              value={draftRow.translation}
              onChange={(e) => handleDraftChange("translation", e.target.value)}
              placeholder="Translation"
              size="small"
              className="!rounded-md !w-28"
            />
          ),
          action: (
            <Button
              type="primary"
              size="small"
              onClick={handleAddRow}
              loading={loading}
              disabled={!draftRow.word || !draftRow.translation}
              className={
                !draftRow.word || !draftRow.translation
                  ? "!rounded-md"
                  : "!bg-green-500 hover:!bg-green-600 active:!bg-green-700 !text-white !rounded-md"
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </Button>
          ),
        },
      ]
    : rows;

  const columnsWithAction = [
    ...columns,
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (value: React.ReactNode) => value || null,
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columnsWithAction}
      pagination={false}
      rowKey="id"
      loading={loading}
    />
  );
};

export default WordTable;
