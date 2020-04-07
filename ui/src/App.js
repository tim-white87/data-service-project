import Amplify, { Auth, Hub } from 'aws-amplify';
import axios from 'axios';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Page from './common/Page';
import AboutMe from './modules/about/AboutMe';
import Messages from './modules/messages/Messages';

// TODO: set these to env vars
Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: process.env.REACT_APP_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.REACT_APP_REDIRECT_SIGN_OUT,
      responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
});

export default class App extends Component {
  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen('auth', async ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          await this.setUser(data);
          break;
        case 'signOut':
          this.setState({ user: null });
          break;
        case 'customOAuthState':
          this.setState({ customState: data });
          break;
        default:
      }
    });

    Auth.currentAuthenticatedUser()
      .then(async (user) => {
        await this.setUser(user);
      })
      .catch(() => console.log('Not signed in'));
  }

  async setUser(user) {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    this.setState({ user });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path='/about'>
            <About user={this.state.user} />
          </Route>
          <Route path='/'>
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
      <Messages {...props}></Messages>
    </Page>
  );
}

function About(props) {
  return (
    <Page {...props}>
      <AboutMe />
    </Page>
  );
}
