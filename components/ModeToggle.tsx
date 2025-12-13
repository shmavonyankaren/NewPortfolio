"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative rounded-lg border border-transparent bg-white/60 text-neutral-700 shadow-sm hover:bg-white/80 hover:border-black/10 dark:bg-black/40 dark:text-neutral-200 dark:hover:bg-black/60 dark:hover:border-white/10"
        >
          <Sun className="h-5 w-5 transition-transform duration-300 ease-out scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-5 w-5 transition-transform duration-300 ease-out scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-36 rounded-xl border border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/70"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
