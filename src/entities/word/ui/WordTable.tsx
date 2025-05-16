import { Table, Input, Button, Tag } from "antd";
import React from "react";

interface WordTableProps {
  rows: { id: number; word: string; translation: string }[];
  draftRow: { word: string; translation: string } | null;
  handleAddRow: () => void;
  handleDraftChange: (field: "word" | "translation", value: string) => void;
  loading: boolean;
  error: string | null;
}

const WordTable: React.FC<WordTableProps> = ({
  rows,
  draftRow,
  handleAddRow,
  handleDraftChange,
  loading,
  error,
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
          id: rows.length + 1,
          word: (
            <Input
              value={draftRow.word}
              onChange={(e) => handleDraftChange("word", e.target.value)}
              placeholder="Word"
              size="small"
            />
          ),
          translation: (
            <Input
              value={draftRow.translation}
              onChange={(e) => handleDraftChange("translation", e.target.value)}
              placeholder="Translation"
              size="small"
            />
          ),
          action: (
            <Button
              type="primary"
              size="small"
              onClick={handleAddRow}
              loading={loading}
            >
              Добавить
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
    <>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Table
        dataSource={dataSource}
        columns={columnsWithAction}
        pagination={false}
        rowKey="id"
        loading={loading}
      />
    </>
  );
};

export default WordTable;
