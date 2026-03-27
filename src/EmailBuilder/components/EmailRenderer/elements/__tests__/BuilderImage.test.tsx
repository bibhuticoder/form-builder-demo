/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderImage from '../BuilderImage';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderImage', () => {
    it('renders image with src and alt', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderImage
                    block={{
                        id: 'image_1',
                        type: EmailBlockType.IMAGE,
                        src: 'https://example.com/photo.jpg',
                        alt: 'A photo',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const img = screen.getByRole('img');
        expect(img).toBeTruthy();
        expect(img.getAttribute('src')).toBe('https://example.com/photo.jpg');
        expect(img.getAttribute('alt')).toBe('A photo');
    });

    it('shows placeholder when src is empty', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderImage
                    block={{
                        id: 'image_2',
                        type: EmailBlockType.IMAGE,
                        src: '',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Add an image URL')).toBeTruthy();
    });

    it('defaults alt text to Image when not provided', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderImage
                    block={{
                        id: 'image_3',
                        type: EmailBlockType.IMAGE,
                        src: 'https://example.com/photo.jpg',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByRole('img').getAttribute('alt')).toBe('Image');
    });
});
