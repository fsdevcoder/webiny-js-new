// @flow
import * as React from "react";
import { ButtonFloating } from "webiny-ui/Button";
import { Elevation } from "webiny-ui/Elevation";
import { ReactComponent as AddIcon } from "webiny-app-cms/editor/assets/icons/add.svg";
import * as Styled from "./StyledComponents";
import { Typography } from "webiny-ui/Typography";

class BlockPreview extends React.Component<*> {
    shouldComponentUpdate(props: Object) {
        return props.plugin.name !== this.props.plugin.name;
    }

    render() {
        const { plugin, addBlockToContent, deactivatePlugin } = this.props;

        return (
            <Elevation z={1} key={plugin.name} className={Styled.blockStyle}>
                <Styled.Overlay>
                    <Styled.Backdrop className={"backdrop"} />
                    <Styled.AddBlock className={"add-block"}>
                        <ButtonFloating
                            label={"Click to Add"}
                            onClick={e => {
                                addBlockToContent(plugin);
                                !e.shiftKey &&
                                    deactivatePlugin({
                                        name: "cms-search-blocks-bar"
                                    });
                            }}
                            icon={<AddIcon />}
                        />
                    </Styled.AddBlock>
                </Styled.Overlay>
                <Styled.BlockPreview>{plugin.preview()}</Styled.BlockPreview>
                <Styled.Title>
                    <Typography use={"overline"}>{plugin.title}</Typography>
                </Styled.Title>
            </Elevation>
        );
    }
}

export default BlockPreview;
