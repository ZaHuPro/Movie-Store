import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter } from 'react-router-dom'

import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import config from './config/config'

const client = new ApolloClient({
    uri: config.GraphQL
});

ReactDOM.render( <ApolloProvider client={client}><BrowserRouter><App /></BrowserRouter></ApolloProvider>, document.getElementById('root'));

serviceWorker.unregister();
