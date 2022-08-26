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

export function RegisterApp() {
  return (
      <div>
          <Navigation />
          <Container>
            <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Register />
              </Col>
            </Row>
          </Container>
      </div>
  );
}

/*When register button is cliked, register function is executed*/
/*This function sends a post request to the API containing user email and password
If result is successful, modal will be opened confirming successful login and directs
user to landing page. If result comes back as an error, error message will be saved
in useState variable and will be displayed to user*/
export function Register() {
  const API_URL = "http://131.181.190.87:3000"
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  /*When */
  function register() {
    const url = `${API_URL}/user/register`

    return fetch(url, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({email:`${email}`, password:`${password}`})
    })
      .then((response) => response.json())
      .then((result) => {
        if ('success' in result) {
          toggle()
        } else if ('error' in result) {
          console.log(result.error)
          setError(result.message)
        }
      })
  }

  /*When form is submitted, email is checked for correct format and password is checked for whether it is there
  If conditions are not met, error messages are set and displayed to user. If passed, user details will be registered */
  return (
    <div>
      <br/>
      <h2>Register</h2>
      <Form onSubmit={(event) => {
        event.preventDefault();
          if (!/.@+/.test(email) || !email || email.length === 0) {
            setError("This is not a valid email");
          } else if (!password || password.length === 0) {
            setError("This is not a valid password");
          } else {
            register()
              .catch(() => { })
          }
      }}>
        <br/>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="example@email.com" value={email}
            onChange={(event) => {
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
          <Button id="submit" type="submit">Register</Button>
        </FormGroup>
        <Modal returnFocusAfterClose={true} isOpen={open}>
        <ModalHeader>CONFIRMATION</ModalHeader>
        <ModalBody>Registration Successful!</ModalBody>
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