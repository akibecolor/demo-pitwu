"use client";

import { useMemo, useState } from "react";
import { Todo, useTodos } from "@/lib/todos";

function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDue(due: string): { label: string; state: "none" | "overdue" | "today" | "future" } {
  if (!due) return { label: "期日なし", state: "none" };
  const today = todayStr();
  const label = due.replace(/-/g, "/");
  if (due < today) return { label, state: "overdue" };
  if (due === today) return { label, state: "today" };
  return { label, state: "future" };
}

export default function Page() {
  const { todos, ready, addTodo, updateTodo, toggleTodo, removeTodo } = useTodos();

  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDue, setEditDue] = useState("");

  // 期日順 → 期日なしは末尾、その中は作成日時の新しい順
  const sorted = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (!a.due && !b.due) return b.createdAt - a.createdAt;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due.localeCompare(b.due);
    });
  }, [todos]);

  const remaining = todos.filter((t) => !t.done).length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addTodo(title, due);
    setTitle("");
    setDue("");
  }

  function startEdit(t: Todo) {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDue(t.due);
  }

  function saveEdit() {
    if (!editingId) return;
    updateTodo(editingId, { title: editTitle, due: editDue });
    setEditingId(null);
  }

  return (
    <main className="container">
      <header className="header">
        <h1>TODO 管理</h1>
        <p className="sub">日程付きのタスクを管理できます（デモ）</p>
      </header>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          className="input title-input"
          type="text"
          placeholder="やることを入力…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="タスク名"
        />
        <input
          className="input date-input"
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          aria-label="期日"
        />
        <button className="btn primary" type="submit">
          追加
        </button>
      </form>

      <div className="status">
        {ready ? (
          <span>
            残り <strong>{remaining}</strong> 件 / 全 {todos.length} 件
          </span>
        ) : (
          <span>読み込み中…</span>
        )}
      </div>

      <ul className="list">
        {ready && todos.length === 0 && (
          <li className="empty">タスクはまだありません。上から追加してください。</li>
        )}

        {sorted.map((t) => {
          const isEditing = editingId === t.id;
          const dueInfo = formatDue(t.due);
          return (
            <li key={t.id} className={`item ${t.done ? "done" : ""}`}>
              {isEditing ? (
                <div className="edit-row">
                  <input
                    className="input"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                  <input
                    className="input date-input"
                    type="date"
                    value={editDue}
                    onChange={(e) => setEditDue(e.target.value)}
                  />
                  <button className="btn primary" onClick={saveEdit}>
                    保存
                  </button>
                  <button className="btn" onClick={() => setEditingId(null)}>
                    取消
                  </button>
                </div>
              ) : (
                <div className="view-row">
                  <input
                    type="checkbox"
                    className="check"
                    checked={t.done}
                    onChange={() => toggleTodo(t.id)}
                    aria-label="完了"
                  />
                  <span className="todo-title">{t.title}</span>
                  <span className={`due due-${dueInfo.state}`}>{dueInfo.label}</span>
                  <span className="actions">
                    <button className="btn small" onClick={() => startEdit(t)}>
                      編集
                    </button>
                    <button
                      className="btn small danger"
                      onClick={() => removeTodo(t.id)}
                    >
                      削除
                    </button>
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <footer className="footer">
        データはこのブラウザ内（localStorage）に保存されます。
      </footer>
    </main>
  );
}
