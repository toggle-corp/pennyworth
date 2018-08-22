import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Home from '#views/Home';
import EditActivity from '#views/EditActivity';


export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/edit-activity/:id?" component={EditActivity} />
                </div>
            </Router>
        );
    }
}
