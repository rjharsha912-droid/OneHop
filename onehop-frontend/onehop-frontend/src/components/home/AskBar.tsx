import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, ArrowUp } from "lucide-react";

export function AskBar() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/chat", { state: { prefill: value.trim() || undefined } });
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-14 items-center gap-3 rounded-pill bg-surface px-4 shadow-card">
      <Search size={20} className="shrink-0 text-muted" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask OneHop anything..."
        className="h-full flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted outline-none"
      />
      <button
        type="submit"
        aria-label="Ask OneHop"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-95"
      >
        {value.trim() ? <ArrowUp size={18} /> : <Mic size={18} />}
      </button>
    </form>
  );
}
