"use client";

import * as React from "react";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function toIsoDate(date: Date | undefined): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromIsoDate(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatDateBR(date: Date | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

export function DatePicker({
  name,
  defaultValue,
  placeholder = "Selecione a data",
  className,
  required,
}: Props) {
  const [date, setDate] = React.useState<Date | undefined>(
    fromIsoDate(defaultValue),
  );
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      <input
        type="hidden"
        name={name}
        value={toIsoDate(date)}
        required={required}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start gap-2 font-normal",
                !date && "text-muted-foreground",
                className,
              )}
            >
              <CalendarIcon className="size-4" />
              {date ? formatDateBR(date) : placeholder}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
            locale={ptBR}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setDate(undefined)}
          aria-label="Limpar data"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
