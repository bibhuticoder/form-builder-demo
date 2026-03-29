/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import EmailBuilder from '../EmailBuilder';

// Mock the shell to avoid deep render
jest.mock("../components/EmailBuilderShell", () => ({
    EmailBuilderShell: () => <div data-testid="email-builder-shell">Shell Content</div>
}));

describe('EmailBuilder', () => {
    it('renders provider and shell', () => {
        render(<EmailBuilder />);
        
        expect(screen.getByTestId('email-builder-shell')).toBeTruthy();
        // Check if the wrapper container is there
        const shell = screen.getByTestId('email-builder-shell');
        expect(shell.parentElement?.parentElement).toHaveClass('w-full');
    });
});
