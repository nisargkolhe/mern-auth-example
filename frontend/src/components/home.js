import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      loggedIn: false,
      msg: ""
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      this.setState({
        loading: false,
        loggedIn: false
      });
    } else if (this.state.loading) {
      try {
        const response = await axios.get("/api/protected", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        this.setState({
          loading: false,
          loggedIn: true,
          user: jwt_decode(token, { header: true }),
          msg: response.data.msg
        });
      } catch (error) {
        console.log(error);
        this.setState({
          loading: false,
          loggedIn: true,
          user: jwt_decode(token, { header: true }),
          msg: "The protected route failed :( Check console for errors"
        });
      }
    }
  }

  logout = e => {
    e.preventDefault();
    localStorage.removeItem("jwtToken");
    this.setState({ loggedIn: false });
  };

  render() {
    if (!this.state.loading && !this.state.loggedIn) {
      return <Redirect to="/login" />;
    }

    if (this.state.loading) {
      return <Spinner as="span" size="lg" role="status" aria-hidden="true" />;
    }

    return (
      <Container>
        <Card>
          <Card.Body>{this.state.msg}</Card.Body>
          <Button variant="primary" type="submit" onClick={this.logout}>
            Logout
          </Button>
        </Card>
      </Container>
    );
  }
}

export default Home;
