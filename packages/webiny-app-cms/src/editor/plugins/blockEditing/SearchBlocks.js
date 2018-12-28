//@flow
import * as React from "react";
import { connect } from "webiny-app-cms/editor/redux";
import { compose, withState } from "recompose";
import { deactivatePlugin, updateElement } from "webiny-app-cms/editor/actions";
import { getContent } from "webiny-app-cms/editor/selectors";
import { withKeyHandler } from "webiny-app-cms/editor/components";
import { getPlugins, unregisterPlugin } from "webiny-plugins";
import { createElement } from "webiny-app-cms/editor/utils";
import { SecondaryLayout } from "webiny-admin/components/Views/SecondaryLayout";
import { ReactComponent as SearchIcon } from "webiny-app-cms/editor/assets/icons/search.svg";
import * as Styled from "./StyledComponents";
import BlockPreview from "./BlockPreview";
import { listItem, ListItemTitle, listStyle, TitleContent } from "./SearchBlocksStyled";
import EditBlockDialog from "./EditBlockDialog";
import { Mutation } from "react-apollo";
import { deleteElement as deleteElementGql, updateElement as updateElementGql } from "./graphql";
import { withSnackbar, type WithSnackbarProps } from "webiny-admin/components";
import {
    SimpleForm,
    SimpleFormContent,
    SimpleFormHeader
} from "webiny-admin/components/Views/SimpleForm";
import { CompactView, LeftPanel, RightPanel } from "webiny-admin/components/Views/CompactView";
import { Icon } from "webiny-ui/Icon";
import { List, ListItem, ListItemGraphic } from "webiny-ui/List";
import { Typography } from "webiny-ui/Typography";
import { ReactComponent as AllIcon } from "./icons/round-clear_all-24px.svg";
import createBlockPlugin from "webiny-app-cms/admin/components/withSavedElements/createBlockPlugin";

type SearchBarProps = {
    addKeyHandler: Function,
    createBlockFromType: Function,
    deactivatePlugin: Function,
    removeKeyHandler: Function,
    updateElement: Function,
    content: Object,
    active: string,
    setActive: Function
} & WithSnackbarProps;

type SearchBarState = {
    search: string,
    activeTab: number,
    editingBlock: ?Object
};

const allBlockCategory = {
    type: "cms-block-category",
    name: "cms-block-category-all",
    title: "All blocks",
    description: "List of all available blocks.",
    icon: <AllIcon />
};

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
    state = {
        search: "",
        activeTab: 0,
        editingBlock: null
    };

    componentDidMount() {
        this.props.addKeyHandler("escape", e => {
            e.preventDefault();
            this.props.deactivatePlugin({ name: "cms-search-blocks-bar" });
        });
    }

    componentWillUnmount() {
        this.props.removeKeyHandler("escape");
    }

    addBlockToContent = plugin => {
        const { content } = this.props;
        const element = { ...content, elements: [...content.elements, createElement(plugin.name)] };
        this.props.updateElement({ element });
    };

    getCategoryBlocksCount({ plugins, category }) {
        return this.getBlocksList({
            blocks: plugins.blocks,
            categories: { active: { name: category } }
        }).length;
    }

    /**
     * Returns a list of blocks - by selected category and by searched term (if present).
     * @param blocks
     * @param categories
     * @returns {*}
     */
    getBlocksList({ blocks, categories }) {
        const activeCategory = categories.active;
        if (!activeCategory) {
            return [];
        }

        let output = blocks;

        // If "all" is selected, no category filtering is required.
        if (activeCategory.name !== "cms-block-category-all") {
            if (activeCategory.name === "cms-block-category-saved") {
                output = output.filter(item => {
                    return item.tags && item.tags.includes("saved");
                });
            } else {
                output = output.filter(item => {
                    return item.category === activeCategory.name;
                });
            }
        }

        // Finally, filter by typed search term.
        if (this.state.search) {
            output = output.filter(item => {
                return item.title.toLowerCase().includes(this.state.search.toLowerCase());
            });
        }

        return output;
    }

    deleteBlock = async ({ plugin, deleteElement }) => {
        const { showSnackbar } = this.props;
        const response = await deleteElement({
            variables: {
                id: plugin.id
            }
        });

        const { error } = response.data.cms.deleteElement;
        if (error) {
            showSnackbar(error.message);
            return;
        }

        unregisterPlugin(plugin.name);
        showSnackbar("Block " + plugin.title + " successfully deleted.");
    };

    updateBlock = async ({ updateElement, data: { title: name, category } }) => {
        const plugin = this.state.editingBlock;
        if (!plugin) {
            return;
        }

        const { showSnackbar } = this.props;
        const response = await updateElement({
            variables: {
                id: plugin.id,
                data: { name, category }
            }
        });

        const { error, data } = response.data.cms.updateElement;
        if (error) {
            showSnackbar(error.message);
            return;
        }

        // This will replace previously registered block plugin.
        createBlockPlugin(data);

        this.setState({ editingBlock: null });
        setTimeout(() => {
            // For better UX, success message is shown after 300ms has passed.
            showSnackbar("Block " + plugin.title + " successfully saved.");
        }, 300);
    };

    renderBlocksList({ plugins, deleteElement, updateElement, blocksList }) {
        return (
            <SimpleForm>
                <SimpleFormHeader
                    title={plugins.categories.active.title}
                    icon={plugins.categories.active.icon}
                />
                <SimpleFormContent>
                    <Styled.BlockList>
                        {blocksList.length > 0 ? (
                            blocksList.map(plugin => (
                                <BlockPreview
                                    key={plugin.name}
                                    plugin={plugin}
                                    onEdit={() => this.setState({ editingBlock: plugin })}
                                    onDelete={() =>
                                        this.deleteBlock({
                                            plugin,
                                            deleteElement
                                        })
                                    }
                                    addBlockToContent={this.addBlockToContent}
                                    deactivatePlugin={this.props.deactivatePlugin}
                                />
                            ))
                        ) : (
                            <div>Nothing to show :/</div>
                        )}
                    </Styled.BlockList>

                    <EditBlockDialog
                        onClose={() => this.setState({ editingBlock: null })}
                        onSubmit={data => this.updateBlock({ data, updateElement })}
                        open={!!this.state.editingBlock}
                        plugin={this.state.editingBlock}
                    />
                </SimpleFormContent>
            </SimpleForm>
        );
    }

    renderSearchInput = () => {
        return (
            <Styled.Input>
                <Icon className={Styled.searchIcon} icon={<SearchIcon />} />
                <input
                    autoFocus
                    type={"text"}
                    placeholder="Search blocks..."
                    value={this.state.search}
                    onChange={e => this.setState({ search: e.target.value })}
                />
            </Styled.Input>
        );
    };

    render() {
        const { active, setActive } = this.props;
        const plugins: Object = {
            categories: {
                list: [allBlockCategory, ...getPlugins("cms-block-category")],
                active: null
            },
            blocks: getPlugins("cms-block")
        };

        plugins.categories.active = plugins.categories.list.find(({ name }) => name === active);
        const blocksList = this.getBlocksList(plugins);

        return (
            <SecondaryLayout
                barMiddle={this.renderSearchInput()}
                onExited={() => this.props.deactivatePlugin({ name: "cms-search-blocks-bar" })}
            >
                <CompactView>
                    <LeftPanel span={3}>
                        <List twoLine className={listStyle}>
                            {plugins.categories.list.map(p => (
                                <ListItem
                                    key={p.name}
                                    className={listItem}
                                    onClick={() => {
                                        setActive(p.name);
                                    }}
                                >
                                    <ListItemGraphic>
                                        <Icon icon={p.icon} />
                                    </ListItemGraphic>
                                    <TitleContent>
                                        <ListItemTitle>
                                            {p.title} (
                                            {this.getCategoryBlocksCount({
                                                plugins,
                                                category: p.name
                                            })}
                                            )
                                        </ListItemTitle>
                                        <Typography use={"subtitle2"}>{p.description}</Typography>
                                    </TitleContent>
                                </ListItem>
                            ))}
                        </List>
                    </LeftPanel>
                    <RightPanel span={9}>
                        <Mutation mutation={updateElementGql}>
                            {updateElement => (
                                <Mutation mutation={deleteElementGql}>
                                    {deleteElement =>
                                        plugins.categories.active &&
                                        this.renderBlocksList({
                                            plugins,
                                            deleteElement,
                                            updateElement,
                                            blocksList
                                        })
                                    }
                                </Mutation>
                            )}
                        </Mutation>
                    </RightPanel>
                </CompactView>
            </SecondaryLayout>
        );
    }
}

export default compose(
    connect(
        state => ({ content: getContent(state) }),
        {
            deactivatePlugin,
            updateElement
        }
    ),
    withKeyHandler(),
    withSnackbar(),
    withState("active", "setActive", "cms-block-category-all")
)(SearchBar);
