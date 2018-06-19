import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

ReactDOM.render(
    (<Router>
        <App>
            <Switch>
                <Route path="/" component={App} />
                <Route path="/autor" />
                <Route path="/livro" />
            </Switch>
        </App>        
    </Router>),
    document.getElementById('root'));

