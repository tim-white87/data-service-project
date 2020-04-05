import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Page from './common/Page';
import Messages from './modules/messages/Messages';

export default function App() {
  return (
    <Router>
      <Switch>
        {/* <Route path="/about">
          <About />
        </Route> */}
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

function Home() {
  return (
    <Page>
      <Messages></Messages>
    </Page>
  );
}

function About() {
  return <Page></Page>;
}
