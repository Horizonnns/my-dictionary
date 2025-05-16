import { Table, Input, Button, Tag, Popconfirm } from "antd";
import React, { useState } from "react";
import type { Word } from "@/shared/wordsApi";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

interface WordTableProps {
  rows: Word[];
  draftRow: { word: string; translation: string } | null;
  handleAddRow: () => void;
  handleDraftChange: (field: "word" | "translation", value: string) => void;
  handleUpdateRow: (id: string, word: string, translation: string) => void;
  handleDeleteRow: (id: string) => void;
  loading: boolean;
  error: string | null;
}

const WordTable: React.FC<WordTableProps> = ({
  rows,
  draftRow,
  handleAddRow,
  handleDraftChange,
  handleUpdateRow,
  handleDeleteRow,
  loading,
  error,
}) => {
  const [editId, setEditId] = useState<string | null>(null);
  const [editWord, setEditWord] = useState("");
  const [editTranslation, setEditTranslation] = useState("");

  const startEdit = (row: Word) => {
    setEditId(row.id);
    setEditWord(row.word);
    setEditTranslation(row.translation);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditWord("");
    setEditTranslation("");
  };
  const saveEdit = () => {
    if (editId) {
      handleUpdateRow(editId, editWord, editTranslation);
      setEditId(null);
    }
  };

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
      render: (_: any, row: Word) =>
        editId === row.id ? (
          <Input
            value={editWord}
            onChange={(e) => setEditWord(e.target.value)}
            size="small"
            className="!rounded-md !w-28"
          />
        ) : (
          <Tag color="blue">{row.word}</Tag>
        ),
    },
    {
      title: "Перевод",
      dataIndex: "translation",
      key: "translation",
      render: (_: any, row: Word) =>
        editId === row.id ? (
          <Input
            value={editTranslation}
            onChange={(e) => setEditTranslation(e.target.value)}
            size="small"
            className="!rounded-md !w-28"
          />
        ) : (
          <Tag color="green">{row.translation}</Tag>
        ),
    },
    {
      title: "",
      key: "action",
      render: (_: any, row: Word) =>
        row.id === "draft" ? null : editId === row.id ? (
          <>
            <Button
              icon={<CheckOutlined />}
              size="small"
              type="primary"
              className="mr-1"
              onClick={saveEdit}
              disabled={!editWord || !editTranslation}
            />
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={cancelEdit}
            />
          </>
        ) : (
          <>
            <Button
              icon={<EditOutlined />}
              size="small"
              className="mr-1"
              onClick={() => startEdit(row)}
            />
            <Popconfirm
              title="Удалить слово?"
              onConfirm={() => handleDeleteRow(row.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </>
        ),
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

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      rowKey="id"
      loading={loading}
      locale={{
        emptyText: error ? error : "Нет данных",
      }}
    />
  );
};

export default WordTable;
