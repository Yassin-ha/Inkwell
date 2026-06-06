"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
    content: string;
    onChange: (content: string) => void;
};

const menuBtn =
    "px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-30";

const PostEditor = ({ content, onChange }: Props) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write your story here...",
            }),
        ],
        content,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose max-w-none min-h-[400px] px-6 py-5 focus:outline-none text-[#1A1A1A] leading-relaxed",
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="border border-[#E0DDD8] rounded-xl overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 px-4 py-3 border-b border-[#E0DDD8] bg-[#F9F7F4]">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`${menuBtn} ${editor.isActive("bold") ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`${menuBtn} italic ${editor.isActive("italic") ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`${menuBtn} line-through ${editor.isActive("strike") ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    S
                </button>

                <div className="w-px h-4 bg-[#E0DDD8] mx-1" />

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`${menuBtn} ${editor.isActive("heading", { level: 1 }) ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`${menuBtn} ${editor.isActive("heading", { level: 2 }) ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`${menuBtn} ${editor.isActive("heading", { level: 3 }) ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    H3
                </button>

                <div className="w-px h-4 bg-[#E0DDD8] mx-1" />

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`${menuBtn} ${editor.isActive("bulletList") ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`${menuBtn} ${editor.isActive("orderedList") ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    1. List
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={`${menuBtn} ${editor.isActive("blockquote") ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    ❝ Quote
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={`${menuBtn} ${editor.isActive("codeBlock") ? "bg-[#8B6F4E] text-white" : "text-[#666] hover:text-[#1A1A1A] hover:bg-white"}`}
                >
                    {"</>"}
                </button>

                <div className="w-px h-4 bg-[#E0DDD8] mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className={`${menuBtn} text-[#666] hover:text-[#1A1A1A] hover:bg-white`}
                >
                    ↩
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className={`${menuBtn} text-[#666] hover:text-[#1A1A1A] hover:bg-white`}
                >
                    ↪
                </button>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />
        </div>
    );
};

export default PostEditor;
