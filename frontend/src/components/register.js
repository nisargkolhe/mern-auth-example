import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Redirect, Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      loading: false,
      error: ""
    };
  }
  componentDidMount() {
    let token = localStorage.getItem("jwtToken");
    if (token) {
      console.log("token", token);
      console.log(token);
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

    if (this.state.password != this.state.password2) {
      this.setState({ loading: false, msg: "Passwords don't match" });
    } else {
      let userData = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      };

      try {
        const res = await axios.post("/api/register", userData);

        this.setState({ loading: false, msg: "Registration Successful." });
      } catch (err) {
        console.log(err);
        this.setState({ loading: false, msg: "Registration Failed." });
      }
    }
  };

  render() {
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
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={this.state.name}
                    onChange={this.handleChange("name")}
                  />
                </Form.Group>
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
                <Form.Group controlId="formGroupPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={this.state.password2}
                    onChange={this.handleChange("password2")}
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
              {this.state.msg ? (
                <Alert variant="danger">{this.state.msg}</Alert>
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

export default Home;
