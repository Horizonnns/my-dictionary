import { useWords } from "@/features/words/model/useWords";

import { Table, Input, Button, Tag } from "antd";

const WordTable = () => {
  const { rows, draftRow, handleAddRow, handleDraftChange } = useWords();

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
    <Table
      dataSource={dataSource}
      columns={columnsWithAction}
      pagination={false}
      rowKey="id"
    />
  );
};

export default WordTable;
