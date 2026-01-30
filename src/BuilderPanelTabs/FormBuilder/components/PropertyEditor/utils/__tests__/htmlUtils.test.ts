/**
 * @jest-environment jsdom
 */
import {
  stripHtmlTags,
  extractLinks,
  reconstructHtmlWithLinks,
} from "../htmlUtils";

describe("HTML Utilities", () => {
  describe("stripHtmlTags", () => {
    it("removes simple HTML tags", () => {
      const html = "Hello <b>world</b>";
      expect(stripHtmlTags(html)).toBe("Hello world");
    });

    it("removes anchor tags with attributes", () => {
      const html = 'Click <a href="https://example.com">here</a>';
      expect(stripHtmlTags(html)).toBe("Click here");
    });

    it("removes multiple anchor tags", () => {
      const html = 'Visit <a href="url1">site1</a> and <a href="url2">site2</a>';
      expect(stripHtmlTags(html)).toBe("Visit site1 and site2");
    });

    it("removes anchor tags with styles", () => {
      const html =
        'Text <a href="url" style="color: blue;">link</a> more';
      expect(stripHtmlTags(html)).toBe("Text link more");
    });

    it("handles nested tags", () => {
      const html = "<p>Hello <b><i>world</i></b></p>";
      expect(stripHtmlTags(html)).toBe("Hello world");
    });

    it("returns empty string for only tags", () => {
      const html = "<p></p><a></a>";
      expect(stripHtmlTags(html)).toBe("");
    });

    it("handles plain text without tags", () => {
      const html = "Plain text";
      expect(stripHtmlTags(html)).toBe("Plain text");
    });
  });

  describe("extractLinks", () => {
    it("extracts single link metadata", () => {
      const html = 'Visit <a href="https://example.com">here</a>';
      const links = extractLinks(html);

      expect(links).toHaveLength(1);
      expect(links[0]).toEqual({
        text: "here",
        href: "https://example.com",
        style: "",
        startIndex: 6,
        endIndex: 10,
      });
    });

    it("extracts multiple links", () => {
      const html =
        'Click <a href="url1">link1</a> and <a href="url2">link2</a>';
      const links = extractLinks(html);

      expect(links).toHaveLength(2);
      expect(links[0].text).toBe("link1");
      expect(links[1].text).toBe("link2");
    });

    it("extracts link with style attribute", () => {
      const html =
        'Text <a href="url" style="color: blue; text-decoration: underline;">link</a>';
      const links = extractLinks(html);

      expect(links).toHaveLength(1);
      expect(links[0].style).toBe("color: blue; text-decoration: underline;");
    });

    it("handles links with single quotes in href", () => {
      const html = "Click <a href='https://example.com'>here</a>";
      const links = extractLinks(html);

      expect(links).toHaveLength(1);
      expect(links[0].href).toBe("https://example.com");
    });

    it("handles links with double quotes in href", () => {
      const html = 'Click <a href="https://example.com">here</a>';
      const links = extractLinks(html);

      expect(links).toHaveLength(1);
      expect(links[0].href).toBe("https://example.com");
    });

    it("returns empty array for text without links", () => {
      const html = "Plain text without links";
      const links = extractLinks(html);

      expect(links).toHaveLength(0);
    });

    it("extracts links with extra attributes", () => {
      const html =
        'Click <a href="url" class="btn" style="color: red;" data-id="123">link</a>';
      const links = extractLinks(html);

      expect(links).toHaveLength(1);
      expect(links[0].href).toBe("url");
      expect(links[0].style).toBe("color: red;");
    });

    it("calculates correct index positions", () => {
      const html = "Heading <a href='url'>rest</a>";
      const links = extractLinks(html);

      expect(links[0].startIndex).toBe(8);
      expect(links[0].endIndex).toBe(12);
    });
  });

  describe("reconstructHtmlWithLinks", () => {
    it("preserves links when text unchanged", () => {
      const original = 'Visit <a href="url">here</a> today';
      const newText = "Visit here today";
      const result = reconstructHtmlWithLinks(newText, original);

      expect(result).toContain('<a href="url"');
      expect(result).toContain(">here</a>");
    });

    it("removes links when link text is deleted", () => {
      const original = 'Visit <a href="url">here</a> today';
      const newText = "Visit today";
      const result = reconstructHtmlWithLinks(newText, original);

      expect(result).not.toContain("<a");
      expect(result).toBe("Visit today");
    });

    it("adds new text before link", () => {
      const original = 'Visit <a href="url">here</a>';
      const newText = "Please visit here";
      const result = reconstructHtmlWithLinks(newText, original);

      expect(result).toMatch(/Please visit <a.*>here<\/a>/);
    });

    it("adds new text after link", () => {
      const original = '<a href="url">here</a> today';
      const newText = "here today please";
      const result = reconstructHtmlWithLinks(newText, original);

      expect(result).toContain("</a> today please");
    });

    it("preserves multiple links", () => {
      const original =
        'Visit <a href="url1">site1</a> and <a href="url2">site2</a>';
      const newText = "Visit site1 and site2 now";
      const result = reconstructHtmlWithLinks(newText, original);

      // Check links are preserved (style attribute may or may not be present)
      expect(result).toContain('href="url1"');
      expect(result).toContain('href="url2"');
      expect(result).toContain(">site1</a>");
      expect(result).toContain(">site2</a>");
      expect(result).toContain("now");
    });

    it("preserves link styles", () => {
      const original =
        'Text <a href="url" style="color: blue;">link</a> here';
      const newText = "Text link here more";
      const result = reconstructHtmlWithLinks(newText, original);

      expect(result).toContain('style="color: blue;"');
    });

    it("returns plain text when no links in original", () => {
      const original = "Plain text";
      const newText = "Updated text";
      const result = reconstructHtmlWithLinks(newText, original);

      expect(result).toBe("Updated text");
    });

    it("handles text insertion in middle of link", () => {
      const original = 'Visit <a href="url">here</a>';
      const newText = "Visit h here";
      const result = reconstructHtmlWithLinks(newText, original);

      // "here" still exists as a contiguous substring, so link is preserved
      expect(result).toContain('href="url"');
      expect(result).toContain("here</a>");
    });

    it("preserves multiple edits with links", () => {
      const original =
        'Welcome to <a href="url">our site</a> today';
      const newText = "Welcome to our site today please";
      const result = reconstructHtmlWithLinks(newText, original);

      // Check link is preserved (style attribute may or may not be present)
      expect(result).toContain('href="url"');
      expect(result).toContain(">our site</a>");
      expect(result).toContain("please");
    });

    it("handles empty new text", () => {
      const original = 'Text <a href="url">link</a>';
      const newText = "";
      const result = reconstructHtmlWithLinks(newText, original);

      expect(result).toBe("");
    });

    it("case sensitive link text matching", () => {
      const original = 'Visit <a href="url">here</a>';
      const newText = "Visit HERE";
      const result = reconstructHtmlWithLinks(newText, original);

      // Case doesn't match, link removed
      expect(result).not.toContain("<a");
    });
  });

  describe("Integration scenarios", () => {
    it("workflow: edit heading with link", () => {
      // Original HTML with link
      const original = 'Heading <a href="https://example.com">rest</a>';

      // User edits text, stripping tags first
      const plainText = stripHtmlTags(original);
      expect(plainText).toBe("Heading rest");

      // User changes to new text
      const newPlainText = "Heading rest more";

      // Reconstruct with preserved link
      const result = reconstructHtmlWithLinks(newPlainText, original);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain(">rest</a>");
      expect(result).toContain("more");
    });

    it("workflow: delete link text completely", () => {
      const original = 'Welcome <a href="url">rest</a>';

      const plainText = stripHtmlTags(original);
      expect(plainText).toBe("Welcome rest");

      // User deletes "rest"
      const newText = "Welcome ";

      const result = reconstructHtmlWithLinks(newText, original);
      expect(result).not.toContain("<a");
    });

    it("workflow: reorder text with links", () => {
      const original =
        'First <a href="url1">link</a> second <a href="url2">link2</a>';

      const plainText = stripHtmlTags(original);
      expect(plainText).toBe("First link second link2");

      // Reorder text - break up "link2" into "link" and "2"
      const newText = "second link 2 First link";

      const result = reconstructHtmlWithLinks(newText, original);
      // "link2" is broken so won't match, but "link" will
      expect(result).toContain('href="url1"');
      expect(result).toContain("link</a>");
      expect(result).toContain("First");
      expect(result).toContain("second");
    });
  });
});
