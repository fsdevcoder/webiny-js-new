import React from "react";
import _ from "lodash";
import linkState from "./linkState";
import validation from "./validation";

class Form extends React.Component {
    static defaultProps = {
        data: {},
        disabled: false,
        validateOnFirstSubmit: false,
        onSubmit: null
    };

    state = {
        data: this.props.data,
        originalData: this.props.data,
        wasSubmitted: false,
        validation: {}
    };

    isValid = null;
    inputs = {};
    lastRender = [];

    static getDerivedStateFromProps({ data, invalidFields = {} }, state) {
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

    componentDidUpdate() {
        Object.keys(this.inputs).forEach(name => {
            if (!this.lastRender.includes(name)) {
                delete this.inputs[name];
                this.setState(({ validation }) => {
                    delete validation[name];
                    return {
                        ...validation
                    };
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
    submit = ({ event } = {}) => {
        // If event is present - prevent default behaviour
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        this.setState({ wasSubmitted: true });

        return this.validate().then(valid => {
            if (valid) {
                const data = this.__removeKeys(this.state.data);
                if (this.props.onSubmit) {
                    return this.props.onSubmit(data);
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
            if (_.isEmpty(validators)) {
                continue;
            }

            const hasValue = !!_.get(this.state.data, name);
            const isInputValid = _.get(this.state.validation[name], "isValid");

            const shouldValidate =
                (!hasValue && validators.required) || (hasValue && isInputValid !== true);

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

    validateInput = name => {
        if ((this.props.validateOnFirstSubmit && !this.state.wasSubmitted) || !this.inputs[name]) {
            return Promise.resolve(null);
        }
        const value = _.get(this.state.data, name);
        const { validators, validationMessages } = this.inputs[name];
        const hasValidators = _.keys(validators).length;

        // Validate input
        const formData = {
            inputs: this.inputs,
            data: { ...this.state.data }
        };

        return Promise.resolve(validation.validate(value, validators, formData))
            .then(validationResults => {
                const isValid = hasValidators ? (value === null ? null : true) : null;

                this.setState(state => {
                    return {
                        ...state,
                        validation: {
                            ...state.validation,
                            [name]: {
                                isValid,
                                message: null,
                                results: validationResults
                            }
                        }
                    };
                });

                return validationResults;
            })
            .catch(validationError => {
                // Set custom error message if defined
                const validator = validationError.getValidator();
                if (validator in validationMessages) {
                    validationError.setMessage(validationMessages[validator]);
                }

                // Set component state to reflect validation error
                this.setState(state => {
                    return {
                        ...state,
                        validation: {
                            ...state.validation,
                            [name]: {
                                isValid: false,
                                message: validationError.getMessage(),
                                results: false
                            }
                        }
                    };
                });

                return false;
            });
    };

    /**
     * @private
     * @param {Object} props
     * @returns {*}
     */
    registerComponent = props => {
        const {
            name,
            defaultValue,
            validators = [],
            validationMessages = {},
            value,
            children: input,
            beforeChange
        } = props;

        let { afterChange } = props;

        const isElement = typeof input !== "function";

        // Track component rendering
        this.lastRender.push(name);

        // Store validators and custom messages
        this.inputs[name] = {
            validators: validation.parseValidators(validators),
            validationMessages
        };

        // Build new input props
        const newProps = {
            form: this,
            validate: () => this.validateInput(name),
            validation: this.state.validation[name] || {
                isValid: null,
                message: null,
                results: null
            }
        };

        // If Form has a `disabled` prop we must evaluate it to see if form input needs to be disabled
        if (this.props.disabled) {
            const inputDisabledByForm = _.isFunction(this.props.disabled)
                ? this.props.disabled({ data: { ...this.state.data } })
                : this.props.disabled;
            // Only override the input prop if the entire Form is disabled
            if (inputDisabledByForm) {
                newProps["disabled"] = true;
            }
        }

        // Assign value and onChange props
        const ls = linkState(this, name === "*" ? "data" : "data." + name, defaultValue);

        const onChange = (newValue, cb) => {
            // When linkState is done processing the value change...
            return ls.onChange(newValue, cb).then(value => {
                // call the Form onChange with updated data
                if (typeof this.props.onChange === "function") {
                    this.props.onChange({ ...this.state.data }, this);
                }

                // Execute onAfterChange
                afterChange && afterChange(value);

                return value;
            });
        };

        _.assign(newProps, {
            value: typeof value === "function" ? value(ls.value) : ls.value,
            onChange: beforeChange ? newValue => beforeChange(newValue, onChange) : onChange
        });

        this.inputs[name].props = newProps;

        return isElement ? React.cloneElement(input, newProps) : input(newProps);
    };

    __removeKeys = (collection, excludeKeys = ["$key", "$index"]) => {
        function omitFn(value) {
            if (value && typeof value === "object") {
                excludeKeys.forEach(key => {
                    delete value[key];
                });
            }
        }

        return _.cloneDeepWith(collection, omitFn);
    };

    __onKeyDown = e => {
        if (
            (e.metaKey || e.ctrlKey) &&
            ["s", "Enter"].indexOf(e.key) > -1 &&
            !e.isDefaultPrevented()
        ) {
            // Need to blur current target in case of input fields to trigger validation
            e.target.blur();
            e.preventDefault();
            e.stopPropagation();
            this.submit();
        }
    };

    render() {
        const children = this.props.children;
        if (!_.isFunction(children)) {
            throw new Error("Form must have a function as its only child!");
        }

        this.lastRender = [];

        return (
            <webiny-form-container onKeyDown={this.__onKeyDown}>
                {children.call(this, {
                    data: _.cloneDeep(this.state.data),
                    form: this,
                    submit: this.submit,
                    Bind: this.registerComponent
                })}
            </webiny-form-container>
        );
    }
}

export default Form;
