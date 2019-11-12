import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div className="auth-box">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/">
              <Container>
                <Card>
                  <Card.Body>
                    <LinkContainer to="/login">
                      <Button variant="primary" size="lg" block>
                        Login
                      </Button>
                    </LinkContainer>
                    <LinkContainer to="/register">
                      <Button variant="primary" size="lg" block>
                        Register
                      </Button>
                    </LinkContainer>
                  </Card.Body>
                </Card>
              </Container>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
