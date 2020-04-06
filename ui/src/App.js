import Amplify, { Auth, Hub } from 'aws-amplify';
import axios from 'axios';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Page from './common/Page';
import Messages from './modules/messages/Messages';

// TODO: set these to env vars
Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_stF9VppFd',
    userPoolWebClientId: '2njonugrnaiuuqncsmodicfu0l',
    oauth: {
      domain: 'data-service-project.auth.us-east-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
});

export default class App extends Component {
  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          this.setState({ user: data });
          break;
        case 'signOut':
          this.setState({ user: null });
          break;
        case 'customOAuthState':
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then(async (user) => {
        this.setState({ user });
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
      })
      .catch(() => console.log('Not signed in'));
  }

  render() {
    return (
      <Router>
        <Switch>
          {/* <Route path="/about">
          <About />
        </Route> */}
          <Route path="/">
            <Home user={this.state.user} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

function Home(props) {
  return (
    <Page {...props}>
      <Messages></Messages>
    </Page>
  );
}

// function About() {
//   return <Page></Page>;
// }
