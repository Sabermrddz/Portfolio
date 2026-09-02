import { Asterisk } from "lucide-react";
import { cn } from "../utils/cn";

interface TickerProps {
  items: string[];
  reverse?: boolean;
  outline?: boolean;
  className?: string;
}

export default function Ticker({ items, reverse = false, outline = false, className }: TickerProps) {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap border-line", className)}>
      <div className={cn("flex w-max items-center", reverse ? "animate-marquee-rev" : "animate-marquee")}>
        {[0, 1, 2, 3].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup > 0}>
            {items.map((item, i) => (
              <span
                key={`${dup}-${i}`}
                className={cn(
                  "flex items-center gap-4 pr-4 font-display text-2xl font-medium uppercase leading-none tracking-tight sm:gap-6 sm:pr-6 sm:text-4xl md:gap-10 md:pr-10 md:text-6xl",
                  outline && "text-outline"
                )}
              >
                {item}
                <Asterisk className="h-5 w-5 text-acid sm:h-8 sm:w-8 md:h-12 md:w-12" strokeWidth={1.5} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
