import React from 'react';
import { createComponent, isElementOfType, i18n } from 'webiny-client';

const t = i18n.namespace("Webiny.Ui.ExpandableList.ActionSet");
class ActionSet extends React.Component {
    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        const { Dropdown } = this.props;
        return (
            <Dropdown title={this.props.label} type="balloon" className="expandable-list__action-set">
                <Dropdown.Header title={t`Actions`}/>
                {React.Children.map(this.props.children, child => {
                    if (isElementOfType(child, Dropdown.Divider) || isElementOfType(child, Dropdown.Header)) {
                        return child;
                    }

                    return (
                        <li role="presentation">
                            {React.cloneElement(child, {
                                data: this.props.data,
                                actions: this.props.actions
                            })}
                        </li>
                    );
                })}
            </Dropdown>
        );
    }
}

ActionSet.defaultProps = {
    label: 'Actions'
};

export default createComponent(ActionSet, { modules: ['Dropdown'] });