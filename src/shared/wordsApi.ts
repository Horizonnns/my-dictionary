import { supabase } from "./supabaseClient";

export type Word = {
  id: string;
  word: string;
  translation: string;
};

export async function getWords(): Promise<Word[]> {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .order("word", { ascending: true });
  if (error) throw error;
  return data as Word[];
}

export async function addWord(
  word: string,
  translation: string
): Promise<Word> {
  const { data, error } = await supabase
    .from("words")
    .insert([{ word, translation }])
    .select()
    .single();
  if (error) throw error;
  return data as Word;
}

export async function updateWord(
  id: string,
  word: string,
  translation: string
): Promise<Word> {
  const { data, error } = await supabase
    .from("words")
    .update({ word, translation })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Word;
}

export async function deleteWord(id: string): Promise<void> {
  const { error } = await supabase.from("words").delete().eq("id", id);
  if (error) throw error;
}
