/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderSocialLinks from '../BuilderSocialLinks';
import { EmailBlockType, SocialPlatform } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderSocialLinks', () => {
    it('renders social link icons', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderSocialLinks
                    block={{
                        id: 'social_1',
                        type: EmailBlockType.SOCIAL_LINKS,
                        links: [
                            { id: 's1', platform: SocialPlatform.FACEBOOK, url: '#' },
                            { id: 's2', platform: SocialPlatform.TWITTER, url: '#' },
                            { id: 's3', platform: SocialPlatform.INSTAGRAM, url: '#' },
                        ],
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('FB')).toBeTruthy();
        expect(screen.getByText('X')).toBeTruthy();
        expect(screen.getByText('IG')).toBeTruthy();
    });

    it('renders linkedin and youtube icons', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderSocialLinks
                    block={{
                        id: 'social_2',
                        type: EmailBlockType.SOCIAL_LINKS,
                        links: [
                            { id: 's1', platform: SocialPlatform.LINKEDIN, url: '#' },
                            { id: 's2', platform: SocialPlatform.YOUTUBE, url: '#' },
                        ],
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('IN')).toBeTruthy();
        expect(screen.getByText('YT')).toBeTruthy();
    });

    it('renders correct number of social icons', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderSocialLinks
                    block={{
                        id: 'social_3',
                        type: EmailBlockType.SOCIAL_LINKS,
                        links: [
                            { id: 's1', platform: SocialPlatform.FACEBOOK, url: '#' },
                            { id: 's2', platform: SocialPlatform.TWITTER, url: '#' },
                        ],
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        const icons = container.querySelectorAll('.rounded-full');
        expect(icons).toHaveLength(2);
    });
});
