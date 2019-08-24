import React from "react";
import { inject } from "webiny-app";
import { withFormComponent } from "webiny-ui";
import css from "./styles.module.scss";

import classNames from "classnames";
import _ from "lodash";

@withFormComponent()
@inject({
    modules: ["Icon", "FormGroup", "Search", "Tags"]
})
class AutoCompleteList extends React.Component {
    render() {
        const { Search, Tags } = this.props.modules;
        const component = this;

        return (
            <Tags
                {...component.props}
                renderTag={function({ value, index }) {
                    const {
                        modules: { Icon },
                        styles
                    } = this.props;
                    return (
                        <div key={_.uniqueId(value.id)} className={styles.block}>
                            <p>{value.name}</p>
                            <Icon icon="times" onClick={() => this.removeTag(index)} />
                        </div>
                    );
                }}
                renderInput={function() {
                    return (
                        <Search
                            {...component.props}
                            onRef={input => (this.tagInput = input)}
                            label={null}
                            render={function() {
                                // TODO: check this, not good.
                                component.search = this;
                                return (
                                    <div
                                        className={classNames(this.props.styles.search, css.input)}
                                    >
                                        {this.props.renderBasicInput.call(this)}
                                        {this.props.renderOptionsDropDown.call(this)}
                                    </div>
                                );
                            }}
                            _________________________CHECK_BELOW_________________________
                            renderOptionLabel={({ option }) => {
                                return <div>{option.label}</div>;
                            }}
                            onChange={async value => {
                                if (value) {
                                    await this.addTag(value);
                                    component.search.reset();
                                }
                            }}
                        />
                    );
                }}
            />
        );
    }
}

AutoCompleteList.defaultProps = {};

export default AutoCompleteList;
