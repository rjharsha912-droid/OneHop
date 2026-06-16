import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-[15px] text-white sm:max-w-[70%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
        <MapPin size={14} />
      </div>
      <div
        className={cn(
          "max-w-[82%] rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-[15px] text-ink shadow-card sm:max-w-[70%]",
          "whitespace-pre-line"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
