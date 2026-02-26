/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderVideo from '../BuilderVideo';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderVideo', () => {
    it('shows placeholder when url is empty', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderVideo
                    block={{
                        id: 'video_1',
                        type: EmailBlockType.VIDEO,
                        url: '',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Add a video URL')).toBeTruthy();
    });

    it('renders youtube embed for youtube url', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderVideo
                    block={{
                        id: 'video_2',
                        type: EmailBlockType.VIDEO,
                        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const iframe = container.querySelector('iframe');
        expect(iframe).toBeTruthy();
        expect(iframe!.getAttribute('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('renders vimeo embed for vimeo url', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderVideo
                    block={{
                        id: 'video_3',
                        type: EmailBlockType.VIDEO,
                        url: 'https://vimeo.com/123456789',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const iframe = container.querySelector('iframe');
        expect(iframe).toBeTruthy();
        expect(iframe!.getAttribute('src')).toBe('https://player.vimeo.com/video/123456789');
    });

    it('renders youtu.be short url', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderVideo
                    block={{
                        id: 'video_4',
                        type: EmailBlockType.VIDEO,
                        url: 'https://youtu.be/dQw4w9WgXcQ',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const iframe = container.querySelector('iframe');
        expect(iframe).toBeTruthy();
        expect(iframe!.getAttribute('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('shows placeholder for unsupported url', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderVideo
                    block={{
                        id: 'video_5',
                        type: EmailBlockType.VIDEO,
                        url: 'https://example.com/random',
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Add a video URL')).toBeTruthy();
    });
});
