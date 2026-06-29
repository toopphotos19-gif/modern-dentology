'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import LinkExt from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Undo, Redo, Image, Link2,
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3,
  Highlighter, Code, Minus
} from 'lucide-react';
import { clsx } from 'clsx';

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  label,
}: {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto' } }),
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Highlight.configure({ multicolor: true }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  function addImage() {
    const url = prompt('Image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  function addLink() {
    const url = prompt('Link URL:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  type BtnProps = {
    onClick: () => void;
    active?: boolean;
    icon: React.ReactNode;
    title: string;
  };

  function ToolBtn({ onClick, active, icon, title }: BtnProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={clsx(
          'rounded-lg p-1.5 transition-colors',
          active
            ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
        )}
      >
        {icon}
      </button>
    );
  }

  const ic = 'h-4 w-4';

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-800">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 dark:border-slate-700 px-2 py-1.5 bg-slate-50 dark:bg-slate-800/80">
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} icon={<Heading1 className={ic} />} title="Heading 1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} icon={<Heading2 className={ic} />} title="Heading 2" />
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} icon={<Heading3 className={ic} />} title="Heading 3" />
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={<Bold className={ic} />} title="Bold" />
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={<Italic className={ic} />} title="Italic" />
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} icon={<UnderlineIcon className={ic} />} title="Underline" />
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} icon={<Strikethrough className={ic} />} title="Strikethrough" />
          <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} icon={<Highlighter className={ic} />} title="Highlight" />
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={<List className={ic} />} title="Bullet List" />
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={<ListOrdered className={ic} />} title="Ordered List" />
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} icon={<Quote className={ic} />} title="Blockquote" />
          <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} icon={<Code className={ic} />} title="Code Block" />
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={<Minus className={ic} />} title="Horizontal Rule" />
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} icon={<AlignLeft className={ic} />} title="Align Left" />
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} icon={<AlignCenter className={ic} />} title="Align Center" />
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} icon={<AlignRight className={ic} />} title="Align Right" />
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          <ToolBtn onClick={addLink} active={editor.isActive('link')} icon={<Link2 className={ic} />} title="Add Link" />
          <ToolBtn onClick={addImage} icon={<Image className={ic} />} title="Add Image" />
          <div className="flex-1" />
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} icon={<Undo className={ic} />} title="Undo" />
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} icon={<Redo className={ic} />} title="Redo" />
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
