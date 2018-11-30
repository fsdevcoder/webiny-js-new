// @flow
import * as React from "react";
import { connect } from "react-redux";
import { compose, withState, withHandlers, lifecycle, shouldUpdate } from "recompose";
import { graphql } from "react-apollo";
import { isEqual, cloneDeep } from "lodash";
import { getPlugin } from "webiny-plugins";
import SaveDialog from "./SaveDialog";
import { withSnackbar } from "webiny-app-admin/components";
import { withKeyHandler } from "webiny-app-cms/editor/components";
import { getActiveElement } from "webiny-app-cms/editor/selectors";
import { createElementPlugin, createBlockPlugin } from "webiny-app-cms/admin/components";
import { createElement } from "webiny-app-cms/admin/graphql/pages";
import { withFileUpload } from "webiny-app/components";

type Props = {
    isDialogOpened: boolean,
    showDialog: Function,
    hideDialog: Function,
    onSubmit: Function,
    children: any,
    element: Object
};

const SaveAction = ({
    showDialog,
    hideDialog,
    isDialogOpened,
    children,
    onSubmit,
    element
}: Props) => {
    const plugin = getPlugin(element.type);
    if (!plugin) {
        return null;
    }

    return (
        <React.Fragment>
            <SaveDialog
                key={element.id}
                element={element}
                open={isDialogOpened}
                onClose={hideDialog}
                onSubmit={onSubmit}
                type={element.type === "cms-element-block" ? "block" : "element"}
            />
            {React.cloneElement(children, { onClick: showDialog })}
        </React.Fragment>
    );
};

const removeIdsAndPaths = el => {
    delete el.id;
    delete el.path;

    el.elements = el.elements.map(el => {
        delete el.id;
        delete el.path;
        if (el.elements && el.elements.length) {
            el = removeIdsAndPaths(el);
        }

        return el;
    });

    return el;
};

export default compose(
    connect(state => ({ element: getActiveElement(state) })),
    withState("isDialogOpened", "setOpenDialog", false),
    shouldUpdate((props, nextProps) => {
        return (
            props.isDialogOpened !== nextProps.isDialogOpened ||
            !isEqual(props.element, nextProps.element)
        );
    }),
    withFileUpload(),
    withKeyHandler(),
    withHandlers({
        showDialog: ({ setOpenDialog }) => () => setOpenDialog(true),
        hideDialog: ({ setOpenDialog }) => () => setOpenDialog(false)
    }),
    graphql(createElement, { name: "createElement" }),
    withSnackbar(),
    withHandlers({
        onSubmit: ({ element, hideDialog, createElement, showSnackbar, uploadFile }) => async (
            formData: Object
        ) => {
            formData.preview = await uploadFile({ src: formData.preview });
            formData.content = removeIdsAndPaths(cloneDeep(element));
            const { data: res } = await createElement({ variables: { data: formData } });
            hideDialog();
            const { data } = res.cms.element;
            if (data.type === "block") {
                createBlockPlugin(data);
            } else {
                createElementPlugin(data);
            }

            showSnackbar(
                <span>
                    {formData.type[0].toUpperCase() + formData.type.slice(1)}{" "}
                    <strong>{data.name}</strong> saved!
                </span>
            );
        }
    }),
    lifecycle({
        componentDidUpdate() {
            const { isDialogOpened, addKeyHandler, removeKeyHandler, hideDialog } = this.props;
            isDialogOpened ? addKeyHandler("escape", hideDialog) : removeKeyHandler("escape");
        }
    })
)(SaveAction);
