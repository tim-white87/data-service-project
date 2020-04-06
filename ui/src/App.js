import Amplify, { Auth, Hub } from 'aws-amplify';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Page from './common/Page';
import Messages from './modules/messages/Messages';

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_stF9VppFd',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '2njonugrnaiuuqncsmodicfu0l',

    // OPTIONAL - Hosted UI configuration
    oauth: {
      domain: 'data-service-project.auth.us-east-1.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
});

// You can get the current config object
// const currentConfig = Auth.configure();

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
      .then((user) => this.setState({ user }))
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
