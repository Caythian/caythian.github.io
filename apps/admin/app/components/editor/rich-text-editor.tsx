"use client";

import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import { uploadImage } from "@/lib/actions/blogs";
import { toast } from "sonner";

interface QuillInstance {
  root: HTMLElement;
  getSelection: (focus?: boolean) => { index: number; length: number } | null;
  insertEmbed: (index: number, type: string, value: string) => void;
  setContents: (delta: any) => void;
  getContents: () => any;
  on: (event: string, handler: (...args: any[]) => void) => void;
  enable: (enabled: boolean) => void;
}

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const RichTextEditor = forwardRef<QuillInstance, RichTextEditorProps>(
  (
    { content, onChange, placeholder = "Start writing...", readOnly = false },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onChangeRef = useRef(onChange);
    const initializedRef = useRef(false);

    useLayoutEffect(() => {
      onChangeRef.current = onChange;
    });

    useEffect(() => {
      if (ref && typeof ref === "object" && ref.current) {
        ref.current.enable(!readOnly);
      }
    }, [ref, readOnly]);

    useEffect(() => {
      const initializeQuill = async () => {
        if (
          typeof window === "undefined" ||
          !containerRef.current ||
          initializedRef.current
        )
          return;

        initializedRef.current = true;

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
                if (
                  result?.key &&
                  ref &&
                  typeof ref === "object" &&
                  ref.current
                ) {
                  const range = ref.current.getSelection(true);
                  if (range) {
                    ref.current.insertEmbed(
                      range.index,
                      "image",
                      `/api/image/${result.key}`,
                    );
                  }
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
        const quill = new Quill(containerRef.current, {
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
        }) as QuillInstance;

        if (ref && typeof ref === "object") {
          ref.current = quill;
        }

        // Set initial content
        if (content) {
          quill.root.innerHTML = content;
        }

        // Listen for changes
        quill.on("text-change", () => {
          onChangeRef.current?.(quill.root.innerHTML);
        });
      };

      initializeQuill();

      return () => {
        if (initializedRef.current && containerRef.current) {
          // In React StrictMode, useEffect is called twice in development.
          // The cleanup function should handle the case where the editor is
          // already destroyed or not yet initialized.
          initializedRef.current = false;
        }
      };
    }, []);

    // Update content when prop changes
    useEffect(() => {
      if (
        ref &&
        typeof ref === "object" &&
        ref.current &&
        content !== ref.current.root.innerHTML
      ) {
        ref.current.root.innerHTML = content || "";
      }
    }, [content, ref]);

    return (
      <div className="border rounded-lg overflow-hidden">
        <div
          ref={containerRef}
          className="[&_.ql-editor]:min-h-[200px] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:bg-muted/50 [&_.ql-container.ql-snow]:border-none"
        />
      </div>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";
