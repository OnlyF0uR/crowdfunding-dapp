import React from 'react';
import Navbar from './Navbar';

export class FundCreate extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <p>Fund create</p>
            </>
        );
    }
}

export class FundList extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <p>Fund list</p>
            </>
        );
    }
}

export class FundDocs extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <p>Fund docs</p>
            </>
        );
    }
}