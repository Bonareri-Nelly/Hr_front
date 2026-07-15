import { MessageCircle, Send, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { executiveTheme } from "../../theme/executiveTheme";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type PageChatbotWidgetProps = {
  page: string;
  role: string;
  contextSummary: string;
  quickPrompts?: string[];
};

export default function PageChatbotWidget({ page, role, contextSummary, quickPrompts = [] }: PageChatbotWidgetProps) {
  const storageKey = `page-chatbot:${page}:${role}`;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) as ChatMessage[] : [];
    } catch {
      return [];
    }
  });

  const starter = useMemo(() => quickPrompts.slice(0, 3), [quickPrompts]);

  const persist = (next: ChatMessage[]) => {
    setMessages(next);
    window.sessionStorage.setItem(storageKey, JSON.stringify(next));
  };

  const answerFor = (question: string) => {
    const lower = question.toLowerCase();
    if (lower.includes("deduction")) return `For ${page}, I can only use ${role}-scoped data. Current context: ${contextSummary}`;
    if (lower.includes("late")) return `Attendance context says: ${contextSummary}`;
    if (lower.includes("enrollment") || lower.includes("benefit")) return `Benefits context says: ${contextSummary}`;
    return `I am using only your ${role} access for ${page}. ${contextSummary}`;
  };

  const send = (text = draft) => {
    const clean = text.trim();
    if (!clean) return;
    const now = new Date().toISOString();
    const next: ChatMessage[] = [
      ...messages,
      { role: "user", content: clean, timestamp: now },
      { role: "assistant", content: answerFor(clean), timestamp: new Date().toISOString() },
    ];
    persist(next);
    setDraft("");
    setOpen(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#101b2c] shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#fffaf0]">Page Assistant</p>
              <p className="text-xs text-[#c8a45d]">{page} • {role}</p>
            </div>
            <button className="rounded-lg p-2 text-[#c9d3df] hover:bg-white/10" onClick={() => setOpen(false)}><X size={16} /></button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && <p className="text-sm text-[#c9d3df]">Ask about this page. I will only use data allowed for your role.</p>}
            {messages.map((message, index) => (
              <div key={`${message.timestamp}-${index}`} className={message.role === "user" ? "text-right" : "text-left"}>
                <span className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.role === "user" ? "bg-[#c8a45d] text-[#111827]" : "bg-white/10 text-[#f8f4ea]"}`}>{message.content}</span>
              </div>
            ))}
          </div>
          {starter.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
              {starter.map((prompt) => <button key={prompt} className="rounded-full bg-white/10 px-3 py-1 text-xs text-[#f8f4ea] hover:bg-white/15" onClick={() => send(prompt)}>{prompt}</button>)}
            </div>
          )}
          <div className="flex gap-2 border-t border-white/10 p-3">
            <input className={`${executiveTheme.input} flex-1`} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Ask this page..." />
            <button className={executiveTheme.buttonPrimary} onClick={() => send()}><Send size={16} /></button>
            <button className={executiveTheme.buttonSecondary} onClick={() => persist([])}><Trash2 size={16} /></button>
          </div>
        </div>
      )}
      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c8a45d] text-[#111827] shadow-2xl shadow-black/40 hover:bg-[#d9b86f]" onClick={() => setOpen((value) => !value)} aria-label="Open page assistant">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
