import { describe, expect, it } from 'vitest';
import { htmlToParagraphs } from '@/utils/text';

describe('htmlToParagraphs', () => {
    it('strips tags, decodes entities and splits on blank lines', () => {
        expect(
            htmlToParagraphs('<b>One</b> &amp; <a href="#">two</a>\r\n\r\nThree\n\n\n<i>four</i>'),
        ).toEqual(['One & two', 'Three', 'four']);
    });

    it('never keeps markup that could run scripts', () => {
        const [paragraph] = htmlToParagraphs(
            '<img src=x onerror="alert(1)">Safe <script>alert(1)</script>',
        );

        expect(paragraph).not.toContain('<');
        expect(paragraph).toContain('Safe');
    });

    it('returns nothing for an empty description', () => {
        expect(htmlToParagraphs('')).toEqual([]);
    });
});
