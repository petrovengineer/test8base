import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// import { Query } from 'react-apollo';
import { gql, useQuery } from '@apollo/client';
import { ApolloClient, InMemoryCache, ApolloProvider  } from '@apollo/client';
import { Query } from 'react-apollo';
import Login from './login';
import Clients from './clients';
import { AppProvider } from '@8base/react-sdk';
import { Auth } from '@8base/auth';
import AuthCallback from './authCallback';
import Client from './client';
import Order from './order';
import Orders from './orders';
import Goods from './goods';

const URI = 'https://api.8base.com/ckgjnbt96001507jn4p9bh8il';

const USER_INFO = gql`
  query UserQuery {
    user {
      firstName
    }
  }
`;


const authClient = Auth.createClient({
  strategy: 'web_cognito',
  subscribable: true,
}, {
  clientId: '5tb7scje5u9mvdegl48kl9818t',
  domain: 'https://5f9069ff8e59090007536bb3.auth.us-east-1.amazoncognito.com',
  redirectUri: `${window.location.origin}/auth/callback`,
  logoutRedirectUri: `${window.location.origin}/`
});


ReactDOM.render(
  <AppProvider uri={URI} authClient={authClient}>
      {({ loading }) => loading ? <p>Please wait...</p> :
      <Router>
        <div>
          <Login/>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/clients">Clients</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/goods">Goods</Link>
            </li>
          </ul>
          <hr/>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/clients">
              <Clients />
            </Route>
            <Route path="/orders">
              <Orders />
            </Route>
            <Route path="/goods">
              <Goods />
            </Route>
            <Route path='/client/:id' render={(props) => {
                    return ( <Client {...props } /> )
                }} />
            <Route path='/order/:id' render={(props) => {
                    return ( <Order {...props } /> )
                }} />
            <Route path="/auth/callback" component={AuthCallback} exact />
          </Switch>
        </div>
      </Router>}
  </AppProvider>
      ,
	document.getElementById("root")
);

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
