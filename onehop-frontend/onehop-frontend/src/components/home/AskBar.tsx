import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, ArrowUp } from "lucide-react";

const PLACEHOLDERS = [
  "Where do you want to go?",
  "Best hotels in Ooty?",
  "Cab from Chennai to Bangalore?",
  "Street food in Mumbai?",
  "Weekend trip near Coimbatore?",
];

export function AskBar() {
  const [value, setValue] = useState("");
  const [phIdx] = useState(() => Math.floor(Math.random() * PLACEHOLDERS.length));
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/chat", { state: { prefill: value.trim() || undefined } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_4px_20px_-4px_rgba(0,119,182,0.15)] border-2 border-[#0077b6]/10 focus-within:border-[#0077b6]/40 transition-colors">
        <Search size={20} className="shrink-0 text-[#0077b6]" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDERS[phIdx]}
          className="h-full flex-1 bg-transparent text-[15px] font-medium text-ink placeholder:text-muted outline-none"
        />
        <button
          type="submit"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0077b6] text-white press shadow-sm"
        >
          {value.trim() ? <ArrowUp size={18} /> : <Mic size={18} />}
        </button>
      </div>
    </form>
  );
}