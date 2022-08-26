import React from "react";
import { useState } from 'react';
import { Navigation } from "./navigation";
import {
  Alert,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from 'reactstrap';
import jwt from 'jsonwebtoken'

export function LoginApp() {
  return (
      <div>
          <Navigation />
          <Container>
            <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Login />
              </Col>
            </Row>
          </Container>
      </div>
  );
}

export function Login() {
  const API_URL = "http://131.181.190.87:3000"
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [open, setOpen] = useState(false);

  /*Toggle function for modal*/
  function toggle() {
    setOpen(!open);
  }

  /*Login function executed when login button clicked*/
  /*Login function posts inputted email and password the API.If the result comes back with an error, the error 
  message will be saved to the error useState variable and will be displayed to the user. If the request was 
  successful, the token and decoded token expiration date will be saved to local storage and error is set to null*/
  function login() {
    const url = `${API_URL}/user/login`

    return fetch(url, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({email:`${email}`, password:`${password}`})
    })
      .then((response) => response.json())
      .then((result) => {
        if ('error' in result) {
          console.log(result.error)
          setError(result.message)
        } else {
          let decodedToken = jwt.decode(result.token)
          localStorage.setItem("token", result.token)
          localStorage.setItem("exp", decodedToken.exp)
          console.log(localStorage.getItem("exp"))
          setError(null)
        }
      })
  }

  /*saveDetails saves user details to local storage*/
  async function saveDetails(email, password) {
    try {
      console.log(email)
      console.log(password)
      await localStorage.setItem("userEmail", email);
      await localStorage.setItem("userPassword", password);
    } catch (error) {
      console.log(error.message);
    }
  };

  /*When login form is submitted, it will check if email is in correct format and if password has been
  inputted. If these conditions are not met, error will be set and displayed to the user. If conditions
  are met, the user is then logged in. If login is successful, details of the user are saved. Local 
  is checked for tokens and if successful, modal is be displayed confirming that login was successful
  and user is then redirected to the landing page*/
  return (
    <div>
      <br/>
      <h2>Sign In</h2>
      <Form onSubmit={(event) => {
        event.preventDefault();
          if (!/.@+/.test(email) || !email || email.length === 0) {
            setError("This is not a valid email");
          } else if (!password || password.length === 0) {
            setError("This is not a valid password");
          } else {
            login()
              .then(() => {
                saveDetails(email, password)
                if (localStorage.getItem("token") !== null) {
                  toggle()
                }
              })
          }
      }}>
        <br/>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="example@email.com" value={email}
            onChange={event => {
              const { value } = event.target; 
              setEmail(value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" name="password" id="password" placeholder="********" value={password}
            onChange={event => {
              const { value } = event.target; 
              setPassword(value);
            }}
          />
        </FormGroup>
        {error != null ? <Alert color="danger">{error}</Alert> : null}
        <FormGroup>
          <Button id="submit" type="submit">Login</Button>
        </FormGroup>
        <Modal returnFocusAfterClose={true} isOpen={open}>
        <ModalHeader>CONFIRMATION</ModalHeader>
        <ModalBody>Login Successful!</ModalBody>
        <ModalFooter>
          <Button color="primary" href="/">
            Return to home
          </Button>
        </ModalFooter>
      </Modal>
      </Form>
    </div>
  );
}