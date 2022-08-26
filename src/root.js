import React from "react";
import { Navigation } from "./navigation";
import {
  Jumbotron,
  Container
} from 'reactstrap';
import bgimage from "./img/jumbotron.jpg"

export function RootApp() {
  return (
      <div>
          <Navigation />
          <Root />
      </div>
  );
}

/*Jumbotron displaying hero image and welcome text*/
export function Root() {
    return (
    <div>
      <Jumbotron style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover', minHeight: 550 }} fluid>
        <Container fluid>
          <h1 className="display-3 text-light">Stock Prices</h1>
          <p className="lead text-light">Welcome to the Stock Analyst portal. 
          Click on Stocks to see the available companies, Quote to get the latest price information by stock symbol, 
          or sign in to see Price History to sample from the most recent one hundred days of information for a particular stock.</p>
        </Container>
      </Jumbotron>
    </div>
  );
}