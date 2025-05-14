"use client";
import { useState } from "react";

export default function Home() {
  const [dictionry, setDictionary] = useState<string[]>([]);

  const addWord = (word: string) => {
    setDictionary([...dictionry, word]);
  };

  return (
    <div>
      <button onClick={() => addWord("hello")}>Add hello word</button>

      <div>
        {dictionry.map((word, index) => (
          <div key={index}>{word}</div>
        ))}
      </div>

      <h1>Hello World</h1>
    </div>
  );
}
