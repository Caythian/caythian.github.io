"use client";

import { useEffect, useRef } from "react";
import { uploadImage } from "@/lib/actions/blogs";
import { toast } from "sonner";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    const initializeQuill = async () => {
      if (
        typeof window === "undefined" ||
        !editorRef.current ||
        quillRef.current
      )
        return;

      // Dynamically import Quill to avoid SSR issues
      const { default: Quill } = await import("quill");

      // Configure custom fonts
      const Font = Quill.import("attributors/class/font");
      const fonts = ["noto-serif", "noto-serif-sc", "playfair"];
      Font.whitelist = fonts;
      Quill.register(Font, true);

      // Configure custom sizes
      const Size = Quill.import("attributors/class/size");
      Size.whitelist = ["title", "subtitle", "body", "caption"];
      Quill.register(Size, true);

      // Image upload handler
      const imageHandler = async () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (file && /^image\//.test(file.type)) {
            try {
              const formData = new FormData();
              formData.append("image", file);

              const result = await uploadImage(formData);
              if (result?.key && quillRef.current) {
                const range = quillRef.current.getSelection(true);
                quillRef.current.insertEmbed(
                  range.index,
                  "image",
                  `/api/files/${result.key}`,
                );
              }
            } catch (error) {
              toast.error("Failed to upload image");
            }
          } else {
            toast.error("You can only upload images");
          }
        };
      };

      // Initialize Quill
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: {
            container: [
              [
                { font: fonts },
                { size: ["body", "title", "subtitle", "caption"] },
              ],
              ["bold", "italic", "underline", "strike"],
              ["link", "image"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote"],
              [{ align: [] }],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
        formats: [
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "link",
          "image",
          "list",
          "blockquote",
          "align",
        ],
      });

      // Set initial content
      if (content) {
        quill.root.innerHTML = content;
      }

      // Listen for changes
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });

      quillRef.current = quill;
    };

    initializeQuill();

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [placeholder]);

  // Update content when prop changes
  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        ref={editorRef}
        className="[&_.ql-editor]:min-h-[200px] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:bg-muted/50"
      />
    </div>
  );
}

