/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import BuilderMenu from '../BuilderMenu';
import { EmailBlockType } from '../../../../types/enums';
import { MockEmailBuilderProvider } from './MockEmailBuilderProvider';

describe('BuilderMenu', () => {
    it('renders menu items', () => {
        render(
            <MockEmailBuilderProvider>
                <BuilderMenu
                    block={{
                        id: 'menu_1',
                        type: EmailBlockType.MENU,
                        items: [
                            { id: 'm1', label: 'Home', url: '/' },
                            { id: 'm2', label: 'About', url: '/about' },
                            { id: 'm3', label: 'Contact', url: '/contact' },
                        ],
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(screen.getByText('Home')).toBeTruthy();
        expect(screen.getByText('About')).toBeTruthy();
        expect(screen.getByText('Contact')).toBeTruthy();
    });

    it('renders inside a nav element', () => {
        const { container } = render(
            <MockEmailBuilderProvider>
                <BuilderMenu
                    block={{
                        id: 'menu_2',
                        type: EmailBlockType.MENU,
                        items: [
                            { id: 'm1', label: 'Link', url: '#' },
                        ],
                        style: {},
                    }}
                />
            </MockEmailBuilderProvider>
        );
        expect(container.querySelector('nav')).toBeTruthy();
    });
});
