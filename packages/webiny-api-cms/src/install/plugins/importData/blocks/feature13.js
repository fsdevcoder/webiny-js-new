export default {
    id: "5c2a73b8a0b03c881190553d",
    name: "Feature #13",
    type: "block",
    content: {
        data: {
            settings: {
                width: { value: "1000px" },
                margin: {
                    mobile: { top: 25, left: 15, right: 15, bottom: 25 },
                    desktop: { top: 100, left: 0, right: 0, bottom: 100 },
                    advanced: true
                },
                padding: { mobile: { all: 10 }, desktop: { all: 0 } },
                background: { image: { src: null } }
            }
        },
        elements: [
            {
                data: {
                    settings: {
                        margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
                    }
                },
                elements: [],
                type: "cms-element-row"
            },
            {
                data: {
                    settings: {
                        margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
                    }
                },
                elements: [
                    {
                        data: {
                            width: 100,
                            settings: {
                                margin: {
                                    desktop: { all: 0, bottom: 25, right: 25, left: 25 },
                                    mobile: { all: 0 },
                                    advanced: true
                                },
                                padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                                    type: "h3",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text: "Webiny CMS",
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
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 15 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 25 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
            },
            {
                data: {
                    settings: {
                        margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
                    }
                },
                elements: [
                    {
                        data: {
                            width: 100,
                            settings: {
                                margin: {
                                    desktop: { all: 0, bottom: 15, right: 20, left: 0 },
                                    mobile: { all: 0, bottom: 15 },
                                    advanced: true
                                },
                                padding: {
                                    desktop: { all: 20, top: 20, right: 20, bottom: 20, left: 20 },
                                    mobile: { all: 15, top: 15, right: 15, bottom: 15, left: 15 }
                                },
                                background: { color: "var(--webiny-cms-theme-surface)" },
                                shadow: {
                                    color: "var(--webiny-cms-theme-background)",
                                    blur: "4",
                                    vertical: "2",
                                    horizontal: "0",
                                    spread: "2"
                                },
                                border: {
                                    width: 5,
                                    radius: 5,
                                    settings: "solid",
                                    borders: { right: false, bottom: false, left: false },
                                    color: "var(--webiny-cms-theme-primary)"
                                }
                            }
                        },
                        elements: [
                            {
                                data: {
                                    icon: {
                                        id: ["far", "star"],
                                        svg:
                                            '<svg width="50" viewBox="0 0 576 512"><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z" fill="currentColor"></path></svg>'
                                    },
                                    settings: {
                                        margin: {
                                            desktop: { all: 0, bottom: 14 },
                                            mobile: { all: 0 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                                    type: "h6",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text: "Feature One",
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
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 15 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 25 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                            data: {},
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "paragraph",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text:
                                                                        "Aute reprehenderit cupidatat aliqua pariatur sit exercitation exercitation consequat nostrud. ",
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
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 15 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 25 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                    type: "outline-primary",
                                    settings: {
                                        margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        horizontalAlignFlex: "center"
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
                            width: 100,
                            settings: {
                                margin: {
                                    desktop: { all: 0, bottom: 15, right: 10, left: 10 },
                                    mobile: { all: 0, bottom: 15 },
                                    advanced: true
                                },
                                padding: {
                                    desktop: { all: 20, top: 20, right: 20, bottom: 20, left: 20 },
                                    mobile: { all: 15, top: 15, right: 15, bottom: 15, left: 15 }
                                },
                                background: { color: "var(--webiny-cms-theme-surface)" },
                                shadow: {
                                    color: "var(--webiny-cms-theme-background)",
                                    blur: "4",
                                    vertical: "2",
                                    horizontal: "0",
                                    spread: "2"
                                },
                                border: {
                                    width: 5,
                                    radius: 5,
                                    settings: "solid",
                                    borders: { right: false, bottom: false, left: false },
                                    color: "var(--webiny-cms-theme-primary)"
                                }
                            }
                        },
                        elements: [
                            {
                                data: {
                                    icon: {
                                        id: ["far", "star"],
                                        svg:
                                            '<svg width="50" viewBox="0 0 576 512"><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z" fill="currentColor"></path></svg>'
                                    },
                                    settings: {
                                        margin: {
                                            desktop: { all: 0, bottom: 14 },
                                            mobile: { all: 0 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                                    type: "h6",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text: "Feature Two",
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
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 15 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 25 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                            data: {},
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "paragraph",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text:
                                                                        "Aute reprehenderit cupidatat aliqua pariatur sit exercitation exercitation consequat nostrud. ",
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
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 15 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 25 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                    type: "outline-primary",
                                    settings: {
                                        margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        horizontalAlignFlex: "center"
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
                            width: 100,
                            settings: {
                                margin: {
                                    desktop: { all: 0, bottom: 15, right: 0, left: 20 },
                                    mobile: { all: 0 },
                                    advanced: true
                                },
                                padding: {
                                    desktop: { all: 20, top: 20, right: 20, bottom: 20, left: 20 },
                                    mobile: { all: 15, top: 15, right: 15, bottom: 15, left: 15 }
                                },
                                background: { color: "var(--webiny-cms-theme-surface)" },
                                shadow: {
                                    color: "var(--webiny-cms-theme-background)",
                                    blur: "4",
                                    vertical: "2",
                                    horizontal: "0",
                                    spread: "2"
                                },
                                border: {
                                    width: 5,
                                    radius: 5,
                                    settings: "solid",
                                    borders: { right: false, bottom: false, left: false },
                                    color: "var(--webiny-cms-theme-primary)"
                                }
                            }
                        },
                        elements: [
                            {
                                data: {
                                    icon: {
                                        id: ["far", "star"],
                                        svg:
                                            '<svg width="50" viewBox="0 0 576 512"><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z" fill="currentColor"></path></svg>'
                                    },
                                    settings: {
                                        margin: {
                                            desktop: { all: 0, bottom: 14 },
                                            mobile: { all: 0 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                                    type: "h6",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text: "Feature Three",
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
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 15 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 25 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                            data: {},
                                            nodes: [
                                                {
                                                    object: "block",
                                                    type: "paragraph",
                                                    data: { align: "center" },
                                                    nodes: [
                                                        {
                                                            object: "text",
                                                            leaves: [
                                                                {
                                                                    object: "leaf",
                                                                    text:
                                                                        "Aute reprehenderit cupidatat aliqua pariatur sit exercitation exercitation consequat nostrud. ",
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
                                        margin: {
                                            mobile: { top: 0, left: 0, right: 0, bottom: 15 },
                                            desktop: { top: 0, left: 0, right: 0, bottom: 25 },
                                            advanced: true
                                        },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } }
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
                                    type: "outline-primary",
                                    settings: {
                                        margin: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        padding: { desktop: { all: 0 }, mobile: { all: 0 } },
                                        horizontalAlignFlex: "center"
                                    }
                                },
                                elements: [],
                                type: "cms-element-button"
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
        name: "cms-element-5c2a73b8a0b03c881190553d_qvkjqcqrjog.png",
        size: 53723,
        src: "http://localhost:9000/files/cms-element-5c2a73b8a0b03c881190553d_qvkjqcqrjog.png",
        type: "image/png",
        width: 1000,
        height: 529
    },
    category: "cms-block-category-features"
};
