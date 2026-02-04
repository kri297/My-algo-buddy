"use client";

import React from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useCodeEditorStore, useVisualizationStore, useSettingsStore } from "@/store";
import { cn } from "@/lib/utils";
import type { ProgrammingLanguage } from "@/types";

interface CodeEditorProps {
  defaultValue?: string;
  language?: ProgrammingLanguage;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  showLanguageSelector?: boolean;
}

const languageMap: Record<ProgrammingLanguage, string> = {
  python: "python",
  javascript: "javascript",
  java: "java",
  cpp: "cpp",
};

const languageLabels: Record<ProgrammingLanguage, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
};

export function CodeEditor({
  defaultValue = "",
  language: propLanguage,
  readOnly = false,
  onChange,
  className,
  showLanguageSelector = true,
}: CodeEditorProps) {
  const { language, setLanguage, code, setCode } = useCodeEditorStore();
  const { highlightedLines } = useVisualizationStore();
  const { settings } = useSettingsStore();
  const editorRef = React.useRef<Parameters<OnMount>[0] | null>(null);
  const decorationsRef = React.useRef<string[]>([]);

  const currentLanguage = propLanguage || language;

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // Update line highlights when highlightedLines changes
  React.useEffect(() => {
    if (editorRef.current) {
      const decorations = highlightedLines.map((line) => ({
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "highlighted-line",
          glyphMarginClassName: "highlighted-glyph",
        },
      }));

      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        decorations
      );
    }
  }, [highlightedLines]);

  const handleChange = (value: string | undefined) => {
    const newValue = value || "";
    setCode(newValue);
    onChange?.(newValue);
  };

  const isDark = settings.theme === "dark" || 
    (settings.theme === "system" && 
      typeof window !== "undefined" && 
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {showLanguageSelector && (
        <div className="flex items-center gap-2 p-2 border-b bg-card">
          <span className="text-sm text-muted-foreground">Language:</span>
          <div className="flex gap-1">
            {(Object.keys(languageMap) as ProgrammingLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors",
                  currentLanguage === lang
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={languageMap[currentLanguage]}
          value={code || defaultValue}
          onChange={handleChange}
          onMount={handleEditorMount}
          theme={isDark ? "vs-dark" : "light"}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: settings.fontSize,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 16 },
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
          }}
        />
      </div>
    </div>
  );
}

// Code comparison component for side-by-side view
export function CodeComparison({
  leftCode,
  rightCode,
  leftTitle = "Iterative",
  rightTitle = "Recursive",
  language = "python",
}: {
  leftCode: string;
  rightCode: string;
  leftTitle?: string;
  rightTitle?: string;
  language?: ProgrammingLanguage;
}) {
  const { settings } = useSettingsStore();
  const isDark = settings.theme === "dark" || 
    (settings.theme === "system" && 
      typeof window !== "undefined" && 
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="flex h-full gap-2">
      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-muted border-b font-medium text-sm">
          {leftTitle}
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language={languageMap[language]}
            value={leftCode}
            theme={isDark ? "vs-dark" : "light"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: settings.fontSize,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-muted border-b font-medium text-sm">
          {rightTitle}
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language={languageMap[language]}
            value={rightCode}
            theme={isDark ? "vs-dark" : "light"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: settings.fontSize,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
