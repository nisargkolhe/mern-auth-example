import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Redirect, Link } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loading: false,
      loggedIn: false,
      error: ""
    };
  }
  componentDidMount() {
    let token = localStorage.getItem("jwtToken");
    if (token) {
      console.log("token", token);
      const decoded = jwt_decode(token);
      if (decoded) {
        this.setState({ loggedIn: true });
      }
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });

    let userData = { email: this.state.email, password: this.state.password };

    try {
      const res = await axios.post("/api/login", userData);

      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      this.setState({ loading: false, loggedIn: true });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false, error: "Login Failed" });
    }
  };

  render() {
    if (this.state.loggedIn === true) {
      return <Redirect to="/home" />;
    }

    return (
      <>
        <Container>
          <Card>
            <Card.Body>
              <p>
                Back to <Link to="/">Home</Link>
              </p>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formGroupEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange={this.handleChange("email")}
                  />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleChange("password")}
                  />
                </Form.Group>

                {this.state.loading ? (
                  <Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button>
                ) : (
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                )}
              </Form>
              {this.state.error ? (
                <Alert variant="danger">{this.state.error}</Alert>
              ) : (
                <></>
              )}
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
}

export default Login;
