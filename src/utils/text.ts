const PARAGRAPH_BREAK = /\r?\n\s*\r?\n/;

function extractText(html: string): string {
    return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
}

export function htmlToParagraphs(html: string): string[] {
    return html
        .split(PARAGRAPH_BREAK)
        .map((paragraph) => extractText(paragraph).replace(/\s+/g, ' ').trim())
        .filter((paragraph) => paragraph !== '');
}
