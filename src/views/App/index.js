import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Auth from '#components/Auth';
import DbSync from '#components/DbSync';

import Home from '#views/Home';
import EditActivity from '#views/EditActivity';
import EditCategory from '#views/EditCategory';


export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Auth>
                <DbSync>
                    <Router>
                        <div>
                            <Route exact path="/" component={Home} />
                            <Route path="/edit-activity/:id?" component={EditActivity} />
                            <Route path="/edit-category/:id?" component={EditCategory} />
                        </div>
                    </Router>
                </DbSync>
            </Auth>
        );
    }
}
