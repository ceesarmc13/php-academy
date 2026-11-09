"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

import { THEME_STORAGE_KEY, type Theme } from "./theme-script";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const getServerSnapshot = (): Theme => "dark";

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable (private mode). The theme still applies for this visit.
    }
  };
  return { theme, setTheme };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={next === "light" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={next === "light" ? "Tema claro" : "Tema oscuro"}
      className={cn(
        "grid size-10 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg",
        className,
      )}
    >
      {theme === "dark" ? <Sun aria-hidden className="size-5" /> : <Moon aria-hidden className="size-5" />}
    </button>
  );
}

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "light", label: "Claro", icon: Sun },
  ];
  return (
    <fieldset>
      <legend className="sr-only">Tema de la interfaz</legend>
      <div className="inline-flex rounded-lg border border-border bg-surface-2 p-1">
        {options.map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className={cn(
              "flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
              theme === value ? "bg-surface text-fg shadow-sm" : "text-fg-muted hover:text-fg",
            )}
          >
            <input
              type="radio"
              name="theme"
              value={value}
              checked={theme === value}
              onChange={() => setTheme(value)}
              className="sr-only"
            />
            <Icon aria-hidden className="size-4" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
