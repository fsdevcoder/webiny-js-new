export default {
    id: "5c28ee3ea0b03c293dcc7a78",
    name: "Content #5",
    type: "block",
    content: {
        data: {
            settings: {
                width: { value: "1000px" },
                margin: {
                    mobile: { top: 15, left: 15, right: 15, bottom: 15 },
                    desktop: { top: 25, left: 0, right: 0, bottom: 25 },
                    advanced: true
                },
                padding: { mobile: { all: 10 }, desktop: { all: 0 } }
            }
        },
        elements: [
            {
                data: {},
                elements: [
                    {
                        data: {
                            width: 50,
                            settings: {
                                margin: { advanced: true, desktop: { right: 50 } },
                                padding: { mobile: { all: 0 }, desktop: { all: 0 } }
                            }
                        },
                        elements: [
                            {
                                data: {
                                    icon: {
                                        id: ["fas", "star"],
                                        color: "var(--webiny-cms-theme-text-primary)",
                                        svg:
                                            '<svg width="50" viewBox="0 0 576 512" color="var(--webiny-cms-theme-text-primary)"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" fill="currentColor"></path></svg>'
                                    },
                                    settings: {
                                        margin: {
                                            desktop: {
                                                all: 0,
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                                left: 0
                                            },
                                            advanced: true,
                                            mobile: { bottom: 15 }
                                        },
                                        padding: {
                                            desktop: {
                                                all: 0,
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                                left: 0
                                            }
                                        },
                                        horizontalAlignFlex: "center",
                                        horizontalAlign: "left"
                                    }
                                },
                                elements: [],
                                type: "cms-element-icon"
                            },
                            {
                                data: {
                                    text: {
                                        object: "value",
                                        document: {
                                            object: "document",
                                            data: {},
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "h4",
                                                    data: {},
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text:
                                                                        "What If They Let You Run The Hubble",
                                                                    marks: [
                                                                        {
                                                                            object: "mark",
                                                                            type: "bold",
                                                                            data: {}
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    settings: {
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        margin: { advanced: true, desktop: { top: 25, bottom: 25 } }
                                    }
                                },
                                elements: [],
                                type: "cms-element-text"
                            },
                            {
                                data: {
                                    text: {
                                        object: "value",
                                        document: {
                                            object: "document",
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "button",
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                { object: "leaf", text: "Click me" }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    type: "simple",
                                    icon: {
                                        id: ["fas", "chevron-circle-right"],
                                        svg:
                                            '<svg width="12" viewBox="0 0 512 512"><path d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z" fill="currentColor"></path></svg>',
                                        position: "right",
                                        width: "12"
                                    },
                                    settings: {
                                        margin: {
                                            desktop: {
                                                all: 0,
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                                left: 0
                                            }
                                        },
                                        padding: {
                                            desktop: {
                                                all: 0,
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                                left: 0
                                            }
                                        },
                                        horizontalAlignFlex: "flex-start"
                                    }
                                },
                                elements: [],
                                type: "cms-element-button"
                            }
                        ],
                        type: "cms-element-column"
                    },
                    {
                        data: {
                            width: 50,
                            settings: {
                                margin: { advanced: true, desktop: { left: 50 } },
                                padding: { desktop: { all: 0 }, mobile: { all: 0 } },
                                verticalAlign: "center"
                            }
                        },
                        elements: [
                            {
                                data: {
                                    text: {
                                        object: "value",
                                        document: {
                                            object: "document",
                                            data: {},
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "paragraph",
                                                    data: {},
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text:
                                                                        "There is a moment in the life of any aspiring astronomer that it is time to buy that first telescope. It’s exciting to think about setting up your own viewing station whether that is on the deck of your home or having.",
                                                                    marks: []
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    },
                                    settings: {
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        margin: { advanced: true, desktop: { top: 45 } }
                                    }
                                },
                                elements: [],
                                type: "cms-element-text"
                            }
                        ],
                        type: "cms-element-column"
                    }
                ],
                type: "cms-element-row"
            }
        ],
        type: "cms-element-block"
    },
    preview: {
        name: "cms-element-5c28ee3ea0b03c293dcc7a78_858jqb3eic9.png",
        size: 33817,
        src: "http://localhost:9000/files/cms-element-5c28ee3ea0b03c293dcc7a78_858jqb3eic9.png",
        type: "image/png",
        width: 1000,
        height: 212
    },
    category: "cms-block-category-content"
};
