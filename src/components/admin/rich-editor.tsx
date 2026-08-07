"use client";

import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const TEXT_COLORS = [
  { label: "기본", value: "" },
  { label: "빨강", value: "#dc2626" },
  { label: "주황", value: "#ea580c" },
  { label: "초록", value: "#16a34a" },
  { label: "파랑", value: "#2563eb" },
  { label: "보라", value: "#9333ea" },
];

const HIGHLIGHT_COLORS = [
  { label: "노랑", value: "#fef08a" },
  { label: "초록", value: "#bbf7d0" },
  { label: "파랑", value: "#bfdbfe" },
  { label: "분홍", value: "#fbcfe8" },
];

function ToolbarButton({
  active,
  ...props
}: ComponentProps<typeof Button> & { active?: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("size-8", active && "bg-accent text-accent-foreground")}
      {...props}
    />
  );
}

export function RichEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "tiptap-content min-h-72 rounded-b-md px-3 py-2 text-base outline-none",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border border-input shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-input p-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="굵게"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="기울임"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="밑줄"
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="취소선"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="글머리 기호 목록"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="번호 목록"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="인용구"
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href as
              | string
              | undefined;
            const url = window.prompt("링크 URL", previousUrl ?? "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          aria-label="링크"
        >
          <LinkIcon className="size-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          aria-label="왼쪽 정렬"
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          aria-label="가운데 정렬"
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          aria-label="오른쪽 정렬"
        >
          <AlignRight className="size-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton aria-label="글자 색상">
              <Palette className="size-4" />
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {TEXT_COLORS.map((color) => (
              <DropdownMenuItem
                key={color.label}
                onSelect={() => {
                  if (color.value) {
                    editor.chain().focus().setColor(color.value).run();
                  } else {
                    editor.chain().focus().unsetColor().run();
                  }
                }}
              >
                <span
                  className="size-3.5 rounded-full border border-border"
                  style={{ backgroundColor: color.value || "var(--color-foreground)" }}
                />
                {color.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton
              active={editor.isActive("highlight")}
              aria-label="형광펜"
            >
              <Highlighter className="size-4" />
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {HIGHLIGHT_COLORS.map((color) => (
              <DropdownMenuItem
                key={color.label}
                onSelect={() =>
                  editor.chain().focus().toggleHighlight({ color: color.value }).run()
                }
              >
                <span
                  className="size-3.5 rounded-full border border-border"
                  style={{ backgroundColor: color.value }}
                />
                {color.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onSelect={() => editor.chain().focus().unsetHighlight().run()}
            >
              지우기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
