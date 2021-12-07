import React from 'react';
import Navbar from './Navbar';

export default class HomeComponent extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <p>An awesome homepage</p>
            </>
        );
    }
}