import { useState, useEffect, useContext } from "react";
import slugify from "slugify";
import { FormEditorContext } from "webiny-app-forms/admin/components/FormEditor";
import { memoize, flatten } from "lodash";
import { getPlugins } from "webiny-plugins";

export default function useEditFieldDialog({ field, open }) {
    const [editField, setField] = useState(field);
    const { formState } = useContext(FormEditorContext);

    useEffect(() => {
        // Each time `open` prop changes, update internal field state.
        setField(field);
    }, [open]);

    const createSlugify = setValue =>
        memoize(name => {
            if (editField._id) {
                return value => value;
            }

            return value =>
                setValue(
                    name,
                    slugify(value, {
                        replacement: "-",
                        lower: true,
                        remove: /[*#\?<>_\{\}\[\]+~.()'"!:;@]/g
                    })
                );
        });

    function uniqueId(value) {
        if (flatten(formState.fields).find(f => editField._id !== f._id && f.id === value)) {
            throw new Error("Please enter a unique ID");
        }
    }

    function getFieldType() {
        const plugin = editField
            ? getPlugins("cms-form-field-type").find(pl => pl.fieldType.id === editField.type)
            : null;

        return plugin ? plugin.fieldType : null;
    }

    return { uniqueId, createSlugify, editField, setField, getFieldType };
}
