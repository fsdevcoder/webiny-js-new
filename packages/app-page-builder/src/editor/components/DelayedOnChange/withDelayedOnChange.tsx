import React from "react";
import Delayed from "./DelayedOnChange";

export default function withDelayedOnChange() {
    return function decorator(Component) {
        const WithDelayedOnChange = props => {
            const { value, onChange, ...rest } = props;
            return (
                <Delayed value={value} onChange={onChange}>
                    {({ value, onChange }) => (
                        <Component {...rest} value={value} onChange={onChange} />
                    )}
                </Delayed>
            );
        };

        return WithDelayedOnChange;
    };
}
