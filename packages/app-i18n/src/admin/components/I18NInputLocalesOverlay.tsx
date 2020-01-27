import * as React from "react";
import ReactDOM from "react-dom";
import { Input } from "@webiny/ui/Input";
import { Grid, Cell } from "@webiny/ui/Grid";
import I18NRichTextEditor from "./I18NRichTextEditor";
import { OverlayLayout } from "@webiny/app-admin/components/OverlayLayout";
import { Form } from "@webiny/form";
import { useI18N } from "@webiny/app-i18n/hooks/useI18N";
import { SplitView, LeftPanel, RightPanel } from "@webiny/app-admin/components/SplitView";
import { List, ListItem } from "@webiny/ui/List";
import { Typography } from "@webiny/ui/Typography";
import { ButtonPrimary, ButtonIcon } from "@webiny/ui/Button";
import { ReactComponent as DoneIcon } from "./icons/baseline-done-24px.svg";

import {
    SimpleForm,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";
import { listItem, ListItemTitle, listStyle, TitleContent } from "./I18NInputLocalesOverlayStyled";

import { i18n } from "@webiny/app/i18n";
const t = i18n.namespace("@webiny/app-i18n/components/translations-overlay");

type ContentProps = {
    richText?: boolean;
    onChange?: Function;
    onClose?: Function;
    onSubmit?: (data: { [key: string]: any }, form: Form) => void;
    images?: boolean;
    multiple?: boolean;
    accept?: Array<string>;
    maxSize?: string;
    multipleMaxCount?: number;
    multipleMaxSize?: string;
    values?: any;
};

const Content = ({ richText, onClose, values, onSubmit }: ContentProps) => {
    const { getLocales } = useI18N();
    const [activeLocaleIndex, setActiveLocaleIndex] = React.useState(0);

    /**
     * In case the i18n dialog is triggered from another dialog, like in the form editor,
     * OverlayLayout has to be displayed in front of the settings dialog which has a z-index of 20
     */
    return (
        <Form submitOnEnter data={values} onSubmit={onSubmit}>
            {({ Bind, submit }) => (
                <OverlayLayout
                    onExited={onClose}
                    style={{ zIndex: 21 }}
                    barRight={
                        <ButtonPrimary onClick={submit}>
                            <ButtonIcon icon={<DoneIcon />} />
                            {t`Save all`}
                        </ButtonPrimary>
                    }
                >
                    <SplitView>
                        <LeftPanel span={3}>
                            <List twoLine className={listStyle}>
                                {getLocales().map((locale, localeIndex) => (
                                    <ListItem
                                        key={locale.id}
                                        className={listItem}
                                        onClick={() => setActiveLocaleIndex(localeIndex)}
                                    >
                                        <TitleContent>
                                            <ListItemTitle>{locale.code}</ListItemTitle>
                                            <Typography use={"subtitle2"}>
                                                {locale.default && t`Default locale.`}
                                            </Typography>
                                        </TitleContent>
                                    </ListItem>
                                ))}
                            </List>
                        </LeftPanel>
                        <RightPanel span={9}>
                            <SimpleForm>
                                <SimpleFormHeader
                                    title={t`Translated text ({locale})`({
                                        locale: getLocales()[activeLocaleIndex].code
                                    })}
                                />
                                <SimpleFormContent>
                                    <Grid>
                                        <Cell span={12}>
                                            {richText ? (
                                                <Bind name={`${activeLocaleIndex}.value`}>
                                                    <I18NRichTextEditor
                                                        label={getLocales()[activeLocaleIndex].code}
                                                    />
                                                </Bind>
                                            ) : (
                                                <Bind name={`${activeLocaleIndex}.value`}>
                                                    <Input
                                                        rows={4}
                                                        label={getLocales()[activeLocaleIndex].code}
                                                    />
                                                </Bind>
                                            )}
                                        </Cell>
                                    </Grid>
                                </SimpleFormContent>
                            </SimpleForm>
                        </RightPanel>
                    </SplitView>
                </OverlayLayout>
            )}
        </Form>
    );
};

export type I18NInputLocalesOverlayProps = ContentProps & {
    open?: boolean;
};

class I18NInputLocalesOverlay extends React.Component<I18NInputLocalesOverlayProps> {
    container: HTMLElement;
    constructor(props) {
        super(props);

        if (!window) {
            return;
        }

        this.container = window.document.getElementById("i18n-input-locales-container");

        if (!this.container) {
            this.container = document.createElement("div");
            this.container.setAttribute("id", "i18n-input-locales-container");
            const container = this.container;
            document.body && document.body.appendChild(container);
        }
    }

    render() {
        const { open, ...rest } = this.props;
        if (!open) {
            return null;
        }

        return ReactDOM.createPortal(<Content {...rest} />, this.container);
    }
}

export default I18NInputLocalesOverlay;
