import React from 'react';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { Editor as TiptapEditor } from '@tiptap/core';

// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';

// --- Styles ---
import './simple-editor.scss';
import { ToolbarGroup } from './toolbar';
import { ListButton } from './list-button';
import { BoldIcon, BulletListIcon } from '@/components/icons';
import { MarkButton } from './mark-button';
import TrailingNode from '../extensions/trailing-node-extension';

const Toolbar = () => {
  return (
    <>
      <ToolbarGroup>
        <MarkButton type="bold">
          <BoldIcon
            className={`tiptap-button-icon !w-[18px] !h-[18px] !fill-gray-900`}
          />
        </MarkButton>
        <ListButton type={'bulletList'} tooltip={''}>
          <BulletListIcon
            className={`tiptap-button-icon !w-[18px] !h-[18px] !fill-gray-900`}
          />
        </ListButton>
        {/* <ListButton type={'orderedList'} tooltip={''}>
          <OrderedListIcon
            className={`!w-[18px] !h-[18px] ${editor?.isActive('orderedList') ? 'fill-primary-700' : '!fill-gray-900'}`}
          />
        </ListButton> */}
      </ToolbarGroup>
    </>
  );
};

interface EditorProps {
  contents: string;
  className?: string;
  setEditor: (editor: TiptapEditor) => void;
}

const Editor = ({ contents, className, setEditor }: EditorProps) => {
  const editor = useEditor(
    {
      immediatelyRender: false,
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          'aria-label': 'Main content area, start typing to enter text.',
        },
      },
      extensions: [StarterKit, TrailingNode],
      content: contents,
      autofocus: false,
      onCreate: ({ editor }) => {
        setEditor?.(editor);
      },
    },
    [contents]
  );
  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar />
      <div className="editor">
        <EditorContent
          editor={editor}
          role="presentation"
          className={`${className} simple-editor-content border border-solid border-gray-400 rounded-8 min-h-[228px]`}
        />
      </div>
    </EditorContext.Provider>
  );
};

export { Editor };
