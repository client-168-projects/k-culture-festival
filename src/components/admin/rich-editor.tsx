"use client";

import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontFamily, FontSize, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Highlighter,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  Quote,
  Strikethrough,
  Type,
  Underline as UnderlineIcon,
} from "lucide-react";
import { type ChangeEvent, type ComponentProps, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/constants/media";
import { cn } from "@/lib/utils";

async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    throw new Error("PNG, JPEG, WEBP, GIF 이미지만 업로드할 수 있습니다.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`이미지는 ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB 이하만 업로드할 수 있습니다.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload/image", {
    method: "POST",
    body: formData,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error ?? "이미지 업로드에 실패했습니다.");
  }
  return body.url as string;
}

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

const FONT_SIZES = [
  { label: "기본", value: "" },
  { label: "작게", value: "14px" },
  { label: "보통", value: "17px" },
  { label: "크게", value: "20px" },
  { label: "아주 크게", value: "26px" },
];

const FONT_FAMILIES = [
  { label: "기본", value: "" },
  { label: "명조체", value: "serif" },
  { label: "고정폭", value: "var(--font-geist-mono), monospace" },
];

function ToolbarButton({
  active,
  className,
  ...props
}: ComponentProps<typeof Button> & { active?: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "size-8",
        active && "bg-accent text-accent-foreground",
        className,
      )}
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
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapImage.configure({
        HTMLAttributes: { class: "max-w-full rounded-md" },
      }),
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
      handlePaste: (view, event) => {
        const file = Array.from(event.clipboardData?.items ?? [])
          .find((item) => item.type.startsWith("image/"))
          ?.getAsFile();
        if (!file) return false;

        event.preventDefault();
        setImageError(null);
        setUploadingImage(true);
        uploadImage(file)
          .then((url) => {
            const node = view.state.schema.nodes.image.create({ src: url });
            view.dispatch(view.state.tr.replaceSelectionWith(node));
          })
          .catch((error: Error) => setImageError(error.message))
          .finally(() => setUploadingImage(false));
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  async function handleImageButtonClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;

    setImageError(null);
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingImage(false);
    }
  }

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
          onClick={handleImageButtonClick}
          disabled={uploadingImage}
          aria-label="이미지 삽입"
        >
          <ImageIcon className="size-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
          className="hidden"
          onChange={handleFileSelected}
        />
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
            <ToolbarButton aria-label="글자 크기" className="w-auto gap-1 px-2">
              <Type className="size-4" />
              <ChevronDown className="size-3" />
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {FONT_SIZES.map((size) => (
              <DropdownMenuItem
                key={size.label}
                onSelect={() => {
                  if (size.value) {
                    editor.chain().focus().setFontSize(size.value).run();
                  } else {
                    editor.chain().focus().unsetFontSize().run();
                  }
                }}
              >
                {size.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton aria-label="글꼴" className="w-auto gap-1 px-2">
              <span className="text-sm">가</span>
              <ChevronDown className="size-3" />
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {FONT_FAMILIES.map((font) => (
              <DropdownMenuItem
                key={font.label}
                style={font.value ? { fontFamily: font.value } : undefined}
                onSelect={() => {
                  if (font.value) {
                    editor.chain().focus().setFontFamily(font.value).run();
                  } else {
                    editor.chain().focus().unsetFontFamily().run();
                  }
                }}
              >
                {font.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
      {uploadingImage ? (
        <p className="border-b border-input px-3 py-1.5 text-sm text-muted-foreground">
          이미지 업로드 중...
        </p>
      ) : null}
      {imageError ? (
        <p className="border-b border-input px-3 py-1.5 text-sm text-destructive">
          {imageError}
        </p>
      ) : null}
      <EditorContent editor={editor} />
    </div>
  );
}
