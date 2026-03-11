import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { ButtonViewBlock } from "./components/button-view-block"

export interface ButtonOptions {
  HTMLAttributes: Record<string, unknown>
}

export const ButtonConfig = Node.create<ButtonOptions>({
  name: "button",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      text: { default: "Click Me" },
      url: { default: "" },
      variant: { default: "default" },
      size: { default: "default" },
      alignment: { default: "left" },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-button-block]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-button-block": "true",
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonViewBlock, {
      className: "block-node",
    })
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state
        if (
          selection.$anchor.parent.type.name === this.name ||
          (selection.empty &&
            selection.$anchor.nodeBefore?.type.name === this.name)
        ) {
          return editor.commands.deleteSelection()
        }
        return false
      },
    }
  },
})

export default ButtonConfig
