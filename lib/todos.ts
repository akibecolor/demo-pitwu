"use client";

import { useCallback, useEffect, useState } from "react";

export type Todo = {
  id: string;
  title: string;
  /** 期日（YYYY-MM-DD）。未設定なら空文字 */
  due: string;
  done: boolean;
  createdAt: number;
};

const STORAGE_KEY = "demo-pitwu.todos.v1";

function load(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Todo[]) : [];
  } catch {
    return [];
  }
}

function save(todos: Todo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [ready, setReady] = useState(false);

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    setTodos(load());
    setReady(true);
  }, []);

  // 変更を localStorage に保存
  useEffect(() => {
    if (ready) save(todos);
  }, [todos, ready]);

  const addTodo = useCallback((title: string, due: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: makeId(),
        title: trimmed,
        due,
        done: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const updateTodo = useCallback(
    (id: string, patch: Partial<Pick<Todo, "title" | "due">>) => {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                ...patch,
                title:
                  patch.title !== undefined ? patch.title.trim() : t.title,
              }
            : t
        )
      );
    },
    []
  );

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { todos, ready, addTodo, updateTodo, toggleTodo, removeTodo };
}
