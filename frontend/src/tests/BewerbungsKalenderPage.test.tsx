import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BewerbungsKalenderPage from '../BewerbungsKalenderPage';

describe('BewerbungsKalenderPage', () => {
    test('renders without crashing', () => {
        render(<BewerbungsKalenderPage />);
        expect(screen.getByTestId('bewerbungs-kalender-page')).toBeInTheDocument();
    });

    // Add more tests here for specific functionalities
});
