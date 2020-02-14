export default () => {
    return {
        editor: [
            {
                name: "pb-editor-slate-editor-scroll",
                type: "pb-editor-slate-editor",
                slate: {
                    onKeyDown(event, change, next) {
                        const native = window.getSelection();
                        if (native.type === "None") {
                            return { top: 0, left: 0, width: 0, height: 0 };
                        }

                        const range = native.getRangeAt(0);
                        const pos = range.getBoundingClientRect();

                        const cursorY = pos.top;
                        const { clientHeight } = document.documentElement;
                        const height = clientHeight - 50;

                        if (cursorY > height) {
                            const scrollDiff = cursorY - height;
                            window.scrollTo(0, window.scrollY + scrollDiff + 20);
                        }

                        return next();
                    }
                }
            }
        ]
    };
};
