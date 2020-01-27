import isHotkey from "is-hotkey";

export default () => {
    return {
        editor: [
            {
                name: "pb-editor-slate-editor-break",
                type: "pb-editor-slate-editor",
                slate: {
                    onKeyDown(e, change, next) {
                        if (isHotkey("shift+enter", e)) {
                            return change.splitBlock().setBlocks("paragraph");
                        }
                        return next();
                    }
                }
            }
        ]
    };
};
