"use client";
import { useState } from "react";
import { Table, Input, Button, Tag } from "antd";
import Header from "@/app/main/Header";

export default function Home() {
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
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
            <Button type="primary" size="small" onClick={handleAddRow}>
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
    <div className="flex flex-col gap-6">
      <Header addWord={handleAddRow} />
      <Table
        dataSource={dataSource}
        columns={columnsWithAction}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
}
