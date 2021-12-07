import React from 'react';
import Navbar from './Navbar';

export default class NewsComponent extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <p>Some bloody news eh?</p>
            </>
        );
    }
}