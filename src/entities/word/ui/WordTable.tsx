import { Table, Input, Button, Tag, Popconfirm } from "antd";
import React, { useState } from "react";
import type { Word } from "@/shared/wordsApi";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface WordTableProps {
  rows: Word[];
  draftRow: { word: string; translation: string } | null;
  handleAddRow: () => void;
  handleDraftChange: (field: "word" | "translation", value: string) => void;
  handleUpdateRow: (id: string, word: string, translation: string) => void;
  handleDeleteRow: (id: string) => void;
  cancelAdd: () => void;
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
  cancelAdd,
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

  interface DraftRow {
    id: "draft";
    word: React.ReactNode;
    translation: React.ReactNode;
    action: React.ReactNode;
  }
  type TableRow = Word | DraftRow;

  const columns = [
    {
      title: "№",
      key: "index",
      render: (_: unknown, __: TableRow, index: number) => index + 1,
    },
    {
      title: "Слово",
      dataIndex: "word",
      key: "word",
      render: (_: string, record: TableRow) => {
        if (record.id === "draft") return record.word;
        return editId === record.id ? (
          <Input
            value={editWord}
            onChange={(e) => setEditWord(e.target.value)}
            size="small"
            className="!text-xs !rounded-md !w-13 !py-1"
          />
        ) : (
          <Tag color="blue">{record.word}</Tag>
        );
      },
    },
    {
      title: "Перевод",
      dataIndex: "translation",
      key: "translation",
      render: (_: string, record: TableRow) => {
        if (record.id === "draft") return record.translation;
        return editId === record.id ? (
          <Input
            value={editTranslation}
            onChange={(e) => setEditTranslation(e.target.value)}
            size="small"
            className="!text-xs !rounded-md !w-13 !py-1"
          />
        ) : (
          <Tag color="green">{record.translation}</Tag>
        );
      },
    },
    {
      title: "Действия",
      key: "action",
      render: (_: string, record: TableRow) => {
        if (record.id === "draft" && "action" in record) return record.action;
        return editId === record.id ? (
          <span className="flex gap-2">
            <Button
              icon={<CheckOutlined />}
              size="small"
              type="primary"
              onClick={saveEdit}
              disabled={!editWord || !editTranslation}
            />
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={cancelEdit}
            />
          </span>
        ) : (
          <span className="flex gap-2">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => startEdit(record as Word)}
            />
            <Popconfirm
              title="Удалить слово?"
              onConfirm={() => handleDeleteRow((record as Word).id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  // Формируем dataSource: если есть draftRow — добавляем её как последнюю строку
  const dataSource: TableRow[] = draftRow
    ? [
        ...rows,
        {
          id: "draft",
          word: (
            <Input
              value={draftRow.word}
              onChange={(e) => handleDraftChange("word", e.target.value)}
              placeholder="Слово"
              size="small"
              className="!text-xs !rounded-md !w-13 !py-1"
            />
          ),
          translation: (
            <Input
              value={draftRow.translation}
              onChange={(e) => handleDraftChange("translation", e.target.value)}
              placeholder="Перевод"
              size="small"
              className="!text-xs !rounded-md !w-13 !py-1"
            />
          ),
          action: (
            <span className="flex gap-2">
              <Button
                icon={<CloseOutlined />}
                size="small"
                onClick={cancelAdd}
                className="!rounded-md"
              />

              <Button
                icon={<PlusOutlined />}
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
              />
            </span>
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
      className="mt-16"
    />
  );
};

export default WordTable;
