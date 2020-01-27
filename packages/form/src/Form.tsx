import * as React from "react";
import _ from "lodash";
import set from "lodash/fp/set";
import { createBind } from "./Bind";
import { linkState } from "./linkState";
import { BindComponent } from "./Bind";
import ValidationError from "./ValidationError";

export type FormChildrenFunctionParamsSubmit = (
    event?: React.SyntheticEvent<any, any>
) => Promise<void>;

export type FormChildrenFunctionParams = {
    data: { [key: string]: any };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    form: Form;
    submit: FormChildrenFunctionParamsSubmit;
    Bind: BindComponent;
    setValue: (name: string, value: any) => void;
};

export type FormChildrenFunction = (params: FormChildrenFunctionParams) => React.ReactElement;

export type FormData = { [key: string]: any };
export type Validation = { [key: string]: any };

// eslint-disable-next-line @typescript-eslint/no-use-before-define
export type FormOnSubmit = (data: FormData, form?: Form) => void;

export type FormProps = {
    invalidFields?: { [key: string]: any };
    data?: FormData;
    disabled?: boolean | Function;
    validateOnFirstSubmit?: boolean;
    submitOnEnter?: boolean;
    onSubmit?: FormOnSubmit;
    onInvalid?: () => void;
    onChange?: FormOnSubmit;
    children: FormChildrenFunction;
};

type State = {
    data: FormData;
    originalData: FormData;
    wasSubmitted: boolean;
    validation: Validation;
};

export class Form extends React.Component<FormProps, State> {
    static defaultProps = {
        data: {},
        disabled: false,
        validateOnFirstSubmit: false,
        onSubmit: null
    };

    state = {
        data: this.props.data || {},
        originalData: this.props.data || {},
        wasSubmitted: false,
        validation: {}
    };

    isValid = null;
    inputs = {};
    lastRender = [];
    validateFns = {};
    onChangeFns = {};
    Bind = createBind(this);

    static getDerivedStateFromProps({ data, invalidFields = {} }: FormProps, state: State) {
        // If we received new `data`, overwrite current `data` in the state
        if (!_.isEqual(state.originalData, data)) {
            return { data, originalData: data, validation: {} };
        }

        // Check for validation errors
        let validation = _.cloneDeep(state.validation);
        if (_.isPlainObject(invalidFields) && Object.keys(invalidFields).length) {
            _.each(invalidFields, (message, name) => {
                validation = {
                    ...validation,
                    [name]: {
                        isValid: false,
                        message
                    }
                };
            });
        }

        // Return new state only if something has changed
        return !_.isEqual(validation, state.validation) ? { validation } : null;
    }

    static executeValidators = async (
        value: any,
        validators: Function | Array<Function>,
        formData: Object = {}
    ): Promise<any> => {
        validators = Array.isArray(validators) ? [...validators] : [validators];

        const results = {};
        for (let i = 0; i < validators.length; i++) {
            const validator = validators[i];
            try {
                await Promise.resolve(validator(value, formData))
                    .then(result => {
                        if (result instanceof Error) {
                            throw result;
                        }
                        results[i] = result;
                    })
                    .catch(e => {
                        throw new ValidationError(e.message, value);
                    });
            } catch (e) {
                throw new ValidationError(e.message, value);
            }
        }

        return results;
    };

    componentDidUpdate() {
        Object.keys(this.inputs).forEach(name => {
            if (!this.lastRender.includes(name)) {
                delete this.inputs[name];
                this.setState((state: State) => {
                    const validation = { ...state.validation };
                    delete validation[name];
                    return { validation };
                });
            }
        });
    }

    onInvalid = () => {
        if (typeof this.props.onInvalid === "function") {
            this.props.onInvalid();
        }
    };

    /**
     * MAIN FORM ACTION METHODS
     */
    submit = (event?: React.SyntheticEvent<any, any>): Promise<void> => {
        // If event is present - prevent default behaviour
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        this.setState({ wasSubmitted: true });

        return this.validate().then(valid => {
            if (valid) {
                let { data } = this.state;

                // Make sure all current inputs have a value in the model (defaultValues do not exist in form data)
                const inputNames = Object.keys(this.inputs);
                inputNames.forEach(name => {
                    const defaultValue = this.inputs[name].defaultValue;
                    if (!_.has(data, name) && typeof defaultValue !== "undefined") {
                        data = set(name, defaultValue, data);
                    }
                });

                if (this.props.onSubmit) {
                    return this.props.onSubmit(data, this);
                }
                return;
            }
            return this.onInvalid();
        });
    };

    validate = async () => {
        let allIsValid = true;

        // Inputs must be validated in a queue because we may have async validators
        const inputNames = Object.keys(this.inputs);
        for (let i = 0; i < inputNames.length; i++) {
            const name = inputNames[i];
            const { validators } = this.inputs[name];
            if (!validators) {
                continue;
            }

            const hasValue = !!_.get(this.state.data, name);
            const isInputValid = _.get(this.state.validation[name], "isValid");

            const shouldValidate = !hasValue || (hasValue && isInputValid !== true);

            if (shouldValidate) {
                if (isInputValid === false || _.isNil(isInputValid)) {
                    const validationResult = await this.validateInput(name);
                    if (validationResult === false) {
                        allIsValid = false;
                    }
                }
            }
        }

        return allIsValid;
    };

    validateInput = async (name: string) => {
        // Want to know why this nonsense is here?
        // When you have a <Tabs> component which has an <Input>, and you try to switch tabs
        // while your input is focused, Tabs end up in an eternal switching loop.
        // I know this is a `webiny-form` package and has nothing to do with
        // who uses it from the outside, but there is no time to come up with a better solution :(
        await new Promise(res => setTimeout(res, 10));

        // Proceed with validation...
        if ((this.props.validateOnFirstSubmit && !this.state.wasSubmitted) || !this.inputs[name]) {
            return Promise.resolve(null);
        }
        const value = _.get(this.state.data, name, this.inputs[name].defaultValue);
        const { validators } = this.inputs[name];
        const hasValidators = _.keys(validators).length;

        // Validate input
        const formData = {
            inputs: this.inputs,
            data: { ...this.state.data }
        };

        this.setState(state => ({
            ...state,
            validation: {
                ...state.validation,
                [name]: {
                    ...state.validation[name],
                    isValidating: true
                }
            }
        }));

        return Promise.resolve(Form.executeValidators(value, validators, formData))
            .then(validationResults => {
                const isValid = hasValidators ? (value === null ? null : true) : null;

                this.setState(state => ({
                    ...state,
                    validation: {
                        ...state.validation,
                        [name]: {
                            isValid,
                            message: null,
                            results: validationResults
                        }
                    }
                }));

                return validationResults;
            })
            .catch(validationError => {
                // Set component state to reflect validation error
                this.setState(state => ({
                    ...state,
                    validation: {
                        ...state.validation,
                        [name]: {
                            isValid: false,
                            message: validationError.getMessage(),
                            results: false
                        }
                    }
                }));

                return false;
            });
    };

    getOnChangeFn = ({
        name,
        beforeChange,
        afterChange
    }: {
        name: string;
        beforeChange: any;
        afterChange: any;
    }) => {
        if (!this.onChangeFns[name]) {
            const linkStateChange = linkState(this, `data.${name}`);

            const baseOnChange = (newValue, cb) => {
                // When linkState is done processing the value change...
                return linkStateChange(newValue, cb).then(value => {
                    // call the Form onChange with updated data
                    if (typeof this.props.onChange === "function") {
                        this.props.onChange({ ...this.state.data }, this);
                    }

                    // Execute onAfterChange
                    afterChange && afterChange(value);

                    return value;
                });
            };

            const onChange = beforeChange
                ? newValue => beforeChange(newValue, baseOnChange)
                : baseOnChange;

            this.onChangeFns[name] = onChange;
        }

        return this.onChangeFns[name];
    };

    getValidateFn = (name: string) => {
        if (!this.validateFns[name]) {
            this.validateFns[name] = () => this.validateInput(name);
        }

        return this.validateFns[name];
    };

    __setValue = (name: string, value: any) => {
        this.onChangeFns[name](value);
    };

    __onKeyDown = (e: React.KeyboardEvent<any>) => {
        const { submitOnEnter = false } = this.props;
        if (
            (submitOnEnter || e.metaKey || e.ctrlKey) &&
            e.key === "Enter" &&
            !e.isDefaultPrevented()
        ) {
            // Need to blur current target in case of input fields to trigger validation
            // @ts-ignore
            e.target && e.target.blur();
            e.preventDefault();
            e.stopPropagation();
            // Fire submit with a small delay to allow input validation to complete.
            // Not an ideal solution but works fine at this point. Will revisit this later.
            setTimeout(() => this.submit(), 100);
        }
    };

    render() {
        const children = this.props.children;
        if (!_.isFunction(children)) {
            throw new Error("Form must have a function as its only child!");
        }

        this.lastRender = [];

        return React.createElement(
            "webiny-form-container",
            { onKeyDown: this.__onKeyDown },
            children({
                data: _.cloneDeep(this.state.data),
                setValue: this.__setValue,
                form: this,
                submit: this.submit,
                Bind: this.Bind
            })
        );
    }
}
