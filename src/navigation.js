import React from "react";
import { useState, useEffect } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
} from 'reactstrap';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Navigation() {
  /*useState variables used to toggle modals and navbar*/
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  /*Toggle function for modal*/
  function toggle2() { 
    setOpen(!open);
  }

  /*Logout function executed once Logout link in navbar is clicked*/
  async function logout() {
    try {
        localStorage.clear();
        toggle2();
    } catch (error) {
        console.log(error.message);
    }
  };

  /*use Effect hook to compare datetime stored in jwt token with the current datetime*/
  /*When datetime of current date is greater than that stored in the token meaning when current date is past expiration date*/
  /*User will be automatically logged out*/
  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      let dateNow = new Date();
      if (localStorage.getItem("exp") < dateNow.getTime()/1000) {
        console.log(localStorage.getItem("exp"))
        console.log(dateNow.getTime())
        logout()
      }
    }
  });

  /*Conditionals added to Reactstrap elements to disable and change visibility of elements as desired*/
  /*Modal will appear when user logs out on any page and will redirect user back to landing page*/
  /*Modal is focused so that it cannot be dismissed when user clicks outside modal*/
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">STOCK</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/stock">Stocks</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/quote">Quote</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled={localStorage.getItem("token") === null ? true : false}href="/history">Price History (Restricted)</NavLink>
            </NavItem>
          </Nav>
          <UncontrolledDropdown>
              <DropdownToggle nav caret>
                <FontAwesomeIcon icon={faUser} />
              </DropdownToggle>
              <DropdownMenu right>
                {localStorage.getItem("token") === null ? 
                <DropdownItem href="/login">
                  Login
                </DropdownItem>: <DropdownItem divider />}
                {localStorage.getItem("token") !== null ? 
                <DropdownItem onClick={logout}>
                  Logout
                </DropdownItem>: null}
                <DropdownItem divider />
                {localStorage.getItem("token") === null ? 
                <DropdownItem href="/register">
                  Register
                </DropdownItem>: null}
              </DropdownMenu>
            </UncontrolledDropdown>
        </Collapse>
      </Navbar>
      <Modal returnFocusAfterClose={true} isOpen={open}>
        <ModalHeader>CONFIRMATION</ModalHeader>
        <ModalBody>Successfully logged out!</ModalBody>
        <ModalFooter>
          <Button color="primary" href="/">
            Return to home
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}