// @flow
import * as React from "react";
import type { PluginType } from "webiny-plugins/types";
import type { WithCmsPropsType } from "webiny-app-cms/context";

export type FieldIdType = string;
export type FieldsLayoutType = [[FieldIdType]];

export type FieldLayoutPositionType = {
    row: number,
    index: ?number
};

export type FieldType = {
    id: FieldIdType,
    fieldId: string,
    label: string,
    helpText: string,
    placeholderText: string,
    type: string,
    validation: Array<any>
} & Object;

export type FormType = {
    id: FieldIdType,
    layout: FieldsLayoutType,
    fields: [FieldType],
    name: string
};

export type FormRenderPropsType = {
    getFieldById: Function,
    getFieldByFieldId: Function,
    getFields: () => [[FieldType]],
    getDefaultValues: () => Object,
    submit: (data: Object) => void,
    form: FormType
};

export type FormComponentPropsType = {
    preview?: boolean,
    data?: Object,
    id?: string
};

export type FormRenderComponentPropsType = {
    preview?: boolean,
    data?: Object,
    client: Object,
    cms: WithCmsPropsType,
    id?: string
};

export type FormLoadComponentPropsType = {
    id: string
};

export type UseFormEditorReducerStateType = {
    apollo: ?Object,
    id: string,
    defaultLayoutRenderer: string
};

export type FormEditorFieldPluginType = PluginType & {
    fieldType: {
        dataType: boolean,
        id: string,
        label: string,
        description: string,
        icon: React.Node,
        validators?: Array<string>,
        createField: Function,
        renderSettings?: ({
            form: Object,
            Bind: React.Node,
            afterLabelChange: () => void,
            uniqueFieldIdValidator: () => void
        }) => React.Node
    }
};
