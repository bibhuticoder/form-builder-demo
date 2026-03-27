import { jsonToHtml } from "../json-to-html";
import { EmailTemplate, EmailBlockType, HeadingLevel, EmailStatus, SocialPlatform } from "../../types";

describe("jsonToHtml", () => {
    const mockTemplate: EmailTemplate = {
        templateSettings: {
            name: "Test Template",
            subject: "Test Subject",
            status: EmailStatus.DRAFT,
            settings: {
                backgroundColor: "#f0f0f0",
                contentWidth: 600,
                fontFamily: "Arial, sans-serif",
                color: "#333333",
            },
        },
        blocks: [
            {
                id: "block-heading",
                type: EmailBlockType.HEADING,
                style: {
                    desktop: {
                        color: "#ff0000",
                        fontSize: 24,
                    },
                },
                content: "Main Heading",
                headingLevel: HeadingLevel.H1,
            },
            {
                id: "block-text",
                type: EmailBlockType.TEXT,
                style: {
                    desktop: {
                        paddingTop: 10,
                        paddingBottom: 10,
                    },
                },
                content: "This is some text with <a href='https://example.com'>a link</a>.",
            },
            {
                id: "block-button",
                type: EmailBlockType.BUTTON,
                style: {
                    desktop: {
                        backgroundColor: "#007bff",
                        color: "#ffffff",
                        paddingTop: 10,
                        paddingRight: 20,
                        paddingBottom: 10,
                        paddingLeft: 20,
                        borderRadius: 5,
                    },
                },
                label: "Click Me",
                url: "https://example.com",
            },
            {
                id: "block-divider",
                type: EmailBlockType.DIVIDER,
                style: {},
            },
            {
                id: "block-spacer",
                type: EmailBlockType.SPACER,
                style: {},
                height: 30,
            },
            {
                id: "block-image",
                type: EmailBlockType.IMAGE,
                style: {},
                src: "https://example.com/image.jpg",
                alt: "Example Image",
                linkUrl: "https://example.com",
            },
            {
                id: "block-columns",
                type: EmailBlockType.COLUMNS,
                style: {},
                columns: [
                    {
                        id: "col-1",
                        width: "50%",
                        blocks: [
                             {
                                id: "block-col-text",
                                type: EmailBlockType.TEXT,
                                style: {},
                                content: "Column Text",
                            },
                        ],
                    },
                     {
                        id: "col-2",
                        width: "50%",
                        blocks: [],
                    },
                ],
            },
            {
                id: "block-social",
                type: EmailBlockType.SOCIAL_LINKS,
                style: {},
                links: [
                    { id: "fb-1", platform: SocialPlatform.FACEBOOK, url: "https://facebook.com" },
                ],
            },
            {
                id: "block-menu",
                type: EmailBlockType.MENU,
                style: {},
                items: [
                   { id: "item-1", label: "Home", url: "https://example.com" },
                ],
            },
             {
                id: "block-discount",
                type: EmailBlockType.DISCOUNT_CODE,
                style: {},
                code: "SAVE50",
                description: "50% Off Everything",
            },
             {
                id: "block-html",
                type: EmailBlockType.HTML,
                style: {},
                content: "<div>Custom HTML Content</div>",
            },
        ],
    };

    it("should generate a full HTML snippet for a template", () => {
        const html = jsonToHtml(mockTemplate);

        // Basic wrapper checks
        expect(html).toContain("<!-- EMAIL START -->");
        expect(html).toContain("<!-- EMAIL END -->");
        expect(html).toContain("bgcolor=\"#f0f0f0\"");
        expect(html).toContain("background-color: #f0f0f0");
        expect(html).toContain("font-family: Arial, sans-serif");
        expect(html).toContain("width=\"600\"");

        // Block checks
        expect(html).toContain("<!-- [Block: HEADING] Main Heading -->");
        expect(html).toContain("color: #ff0000");
        expect(html).toContain("font-size: 24px");
        expect(html).toContain("Main Heading</h1>");

        expect(html).toContain("<!-- [Block: TEXT] This is some text with <a href='https://example.com'>a link</a>. -->");
        expect(html).toContain("padding-top: 10px");
        expect(html).toContain("padding-bottom: 10px");
        expect(html).toContain("This is some text with <a href='https://example.com'>a link</a>.</div>");

        expect(html).toContain("<!-- [Block: BUTTON] Click Me -->");
        expect(html).toContain("href=\"https://example.com\"");
        expect(html).toContain("Click Me</a>");

        expect(html).toContain("<hr");

        expect(html).toContain("height: 30px");

        expect(html).toContain("src=\"https://example.com/image.jpg\"");
        expect(html).toContain("alt=\"Example Image\"");

        expect(html).toContain("Column Text");

        expect(html).toContain(">facebook</a>");

        expect(html).toContain(">Home</a>");

        expect(html).toContain("SAVE50");
        expect(html).toContain("50% Off Everything");

        expect(html).toContain("<div>Custom HTML Content</div>");
    });
    
    it("should use default body background color if missing", () => {
        const templateNoBg = JSON.parse(JSON.stringify(mockTemplate));
        delete templateNoBg.templateSettings.settings.backgroundColor;
        const html = jsonToHtml(templateNoBg);
        expect(html).toContain("bgcolor=\"#ffffff\"");
    });
    
    it("should use default font family if missing", () => {
        const templateNoFont = JSON.parse(JSON.stringify(mockTemplate));
        delete templateNoFont.templateSettings.settings.fontFamily;
        const html = jsonToHtml(templateNoFont);
        expect(html).toContain("font-family: Arial, sans-serif");
    });
    
    it("should use default content width if missing", () => {
        const templateNoWidth = JSON.parse(JSON.stringify(mockTemplate));
        delete templateNoWidth.templateSettings.settings.contentWidth;
        const html = jsonToHtml(templateNoWidth);
        expect(html).toContain("width=\"600\"");
        expect(html).toContain("max-width: 600px");
    });

    it("should render an empty template wrapper", () => {
        const emptyTemplate: EmailTemplate = {
            templateSettings: { 
                name: "Empty",
                subject: "Empty",
                status: EmailStatus.DRAFT,
                settings: { fontFamily: "Arial, sans-serif" } 
            },
            blocks: [],
        };
        const html = jsonToHtml(emptyTemplate);
        expect(html).toContain("<!-- CONTENT CONTAINER -->");
        expect(html).not.toContain("<!-- [Block:");
    });
});
