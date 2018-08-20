import React from 'react';
import Auth from '#components/Auth';
import Dashboard from '#views/Dashboard';


export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Auth>
                <Dashboard />
            </Auth>
        );
    }
}
