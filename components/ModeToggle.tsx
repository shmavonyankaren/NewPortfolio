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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative rounded-full border border-purple-200 bg-purple-50 text-purple-700 shadow-sm hover:bg-purple-100 hover:border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-400/30 dark:hover:bg-purple-500/30 dark:hover:border-purple-400/50 transition-all"
        >
          <Sun className="h-5 w-5 transition-transform duration-300 ease-out scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-5 w-5 transition-transform duration-300 ease-out scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-36 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-lg dark:border-purple-500/30 dark:bg-[#1a1f3a]/95 z-9999"
        sideOffset={8}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="text-gray-700 hover:bg-red-500 hover:text-purple-700 dark:text-gray-200 dark:hover:bg-purple-500/20 dark:hover:text-purple-300 cursor-pointer rounded-lg"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="text-gray-700 hover:bg-purple-100 hover:text-purple-700 dark:text-gray-200 dark:hover:bg-purple-500/20 dark:hover:text-purple-300 cursor-pointer rounded-lg"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="text-gray-700 hover:bg-purple-100 hover:text-purple-700 dark:text-gray-200 dark:hover:bg-purple-500/20 dark:hover:text-purple-300 cursor-pointer rounded-lg"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
