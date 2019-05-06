import React from "react";
import { css } from "emotion";
import styled from "react-emotion";
import { SplitView, LeftPanel, RightPanel } from "webiny-admin/components/SplitView";
import { Tabs, Tab } from "webiny-ui/Tabs";
import { EditTab } from "./EditTab";
import { TriggersTab } from "./TriggersTab";
import { Fields } from "./Fields";

const ContentContainer = styled("div")({
    paddingTop: 65
});

const leftPanel = css({ padding: 40 });

export default function Content() {

    return (
        <ContentContainer>
            <SplitView>
                <LeftPanel span={4} className={leftPanel}>
                    <Fields/>
                </LeftPanel>
                <RightPanel span={8}>
                    <Tabs>
                        <Tab label={"Edit"}>
                            <EditTab/>
                        </Tab>
                        <Tab label={"Triggers"}>
                            <TriggersTab/>
                        </Tab>
                    </Tabs>
                </RightPanel>
            </SplitView>
        </ContentContainer>
    );
}
