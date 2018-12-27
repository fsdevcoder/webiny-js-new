//@flow
import * as React from "react";
import { Transition } from "react-transition-group";
import styled from "react-emotion";
import { TopAppBarSecondary, TopAppBarSection } from "webiny-ui/TopAppBar";
import { IconButton } from "webiny-ui/Button";

import { ReactComponent as CloseIcon } from "./icons/close.svg";

const SecondaryLayoutWrapper = styled("div")({
    position: "fixed",
    width: "100%",
    height: "100vh",
    backgroundColor: "var(--mdc-theme-background)",
    zIndex: 4,
    paddingTop: 65
});

const defaultStyle = {
    transform: "translateY(75vh)",
    opacity: 0,
    transitionProperty: "transform, opacity",
    transitionTimingFunction: "cubic-bezier(0, 0, .2, 1)",
    transitionDuration: "225ms",
    willChange: "opacity, transform"
};

const transitionStyles = {
    entering: { transform: "translateY(75vh)", opacity: 0 },
    entered: { transform: "translateY(0px)", opacity: 1 }
};

type Props = {
    barMiddle?: React.Node,
    barLeft?: React.Node,
    children: React.Node,
    onExited?: Function
};

type State = {
    isVisible: boolean
};

class SecondaryLayout extends React.Component<Props, State> {
    static defaultProps = {
        onExited: () => {}
    };

    state = { isVisible: true };

    hideComponent = () => {
        this.setState({ isVisible: false });
    };

    render() {
        return (
            <Transition
                in={this.state.isVisible}
                timeout={100}
                appear={true}
                onExited={this.props.onExited}
            >
                {state => (
                    <SecondaryLayoutWrapper style={{ ...defaultStyle, ...transitionStyles[state] }}>
                        <TopAppBarSecondary fixed style={{ top: 0 }}>
                            <TopAppBarSection style={{ width: "33%" }} alignStart>
                                {this.props.barLeft}
                            </TopAppBarSection>
                            <TopAppBarSection style={{ width: "33%" }}>
                                {this.props.barMiddle}
                            </TopAppBarSection>
                            <TopAppBarSection style={{ width: "33%" }} alignEnd>
                                <IconButton
                                    ripple={false}
                                    onClick={() => {
                                        this.hideComponent();
                                    }}
                                    icon={<CloseIcon style={{ width: 24, height: 24 }} />}
                                />
                            </TopAppBarSection>
                        </TopAppBarSecondary>

                        {this.props.children}
                    </SecondaryLayoutWrapper>
                )}
            </Transition>
        );
    }
}

export default SecondaryLayout;
