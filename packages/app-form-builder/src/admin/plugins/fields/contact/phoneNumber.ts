import textFieldPlugin from "./../text";
import { FbBuilderFieldPlugin } from "@webiny/app-form-builder/types";

const plugin: FbBuilderFieldPlugin = {
    type: "form-editor-field-type",
    name: "form-editor-field-type-phone-number",
    field: {
        ...textFieldPlugin.field,
        unique: true,
        group: "form-editor-field-group-contact",
        name: "phoneNumber",
        label: "Phone number",
        createField(props) {
            const { i18n } = props;
            return {
                ...textFieldPlugin.field.createField(props),
                name: this.name,
                fieldId: "phoneNumber",
                label: {
                    values: [
                        {
                            locale: i18n.getDefaultLocale().id,
                            value: "Phone number"
                        }
                    ]
                }
            };
        }
    }
};

export default plugin;
