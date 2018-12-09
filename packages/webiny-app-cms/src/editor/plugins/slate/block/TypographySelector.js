// @flow
import React from "react";
import Downshift from "downshift";
import styled from "react-emotion";
import { css } from "emotion";
import { Elevation } from "webiny-ui/Elevation";
import { withCms } from "webiny-app-cms/context";

const Item = styled("div")(({ isActive, isSelected }) => ({
    cursor: "pointer",
    display: "block",
    border: "none",
    height: "auto",
    textAlign: "left",
    borderTop: "none",
    lineHeight: "1em",
    color: "var(--mdc-theme-text-primary-on-background)",
    fontSize: "1rem",
    textTransform: "none",
    boxShadow: "none",
    padding: ".8rem 1.1rem",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    wordWrap: "normal",
    backgroundColor: isActive ? "var(--mdc-theme-on-background)" : "var(--mdc-theme-surface)",
    fontWeight: isSelected ? "bold" : "normal",
    "&:hover, &:focus": {
        borderColor: "#96c8da",
        boxShadow: "0 2px 3px 0 rgba(34,36,38,.15)"
    }
}));

const List = styled("div")({
    border: "var(--mdc-theme-on-background)",
    backgroundColor: "var(--mdc-theme-surface)",
    position: "relative",
    left: 0,
    top: 0,
    height: "200px",
    width: "100%",
    overflow: "scroll"
});

const dropDownDialog = css({
    position: "absolute",
    zIndex: "2",
    top: 27,
    left: -5,
    width: 200
});

const Button = styled("div")({
    padding: "1px 3px 3px 3px",
    backgroundColor: "var(--mdc-theme-on-background)",
    fontSize: "0.8em",
    whiteSpace: "nowrap",
    lineHeight: "110%"
});

class TypographySelector extends React.Component {
    state = {
        showMenu: false
    };

    dropdown = React.createRef();

    componentDidUpdate() {
        if (this.state.showMenu) {
            const domRect = this.dropdown.current.getBoundingClientRect();
            if (domRect.right > window.innerWidth) {
                this.dropdown.current.style.left = window.innerWidth - domRect.right + "px";
            }
        }
    }

    setBlock = type => {
        const { editor, onChange } = this.props;

        editor.change(change => onChange(change.setBlocks(type)));
    };

    render() {
        const { editor, theme } = this.props;

        let blockType = editor.value.blocks.first().type;
        const style = theme.styles[blockType] || theme.styles.paragraph;

        return (
            <Downshift
                selectedItem={blockType}
                onChange={this.setBlock}
                onStateChange={({ isOpen }) => this.setState({ showMenu: isOpen })}
            >
                {({
                    isOpen,
                    getToggleButtonProps,
                    getItemProps,
                    highlightedIndex,
                    selectedItem
                }) => (
                    <div>
                        <Button {...getToggleButtonProps()}>{style.label}</Button>
                        {isOpen && (
                            <Elevation z={2} className={dropDownDialog}>
                                <div ref={this.dropdown}>
                                    <List>
                                        {Object.keys(theme.styles).map((name, index) => {
                                            const style = theme.styles[name];

                                            return (
                                                <Item
                                                    {...getItemProps({
                                                        item: name,
                                                        isActive: highlightedIndex === index,
                                                        isSelected: selectedItem === name
                                                    })}
                                                    key={name}
                                                >
                                                    {React.createElement(
                                                        style.component || "span",
                                                        { style: style.style },
                                                        style.label
                                                    )}
                                                </Item>
                                            );
                                        })}
                                    </List>
                                </div>
                            </Elevation>
                        )}
                    </div>
                )}
            </Downshift>
        );
    }
}

export default withCms()(TypographySelector);
