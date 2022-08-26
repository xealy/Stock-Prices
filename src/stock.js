import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation";
import {
  Alert,
  Container,
  Row,
  Col,
  Badge, 
  Input, 
  InputGroup
} from 'reactstrap';
import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"

export function StockApp() {
  return (
      <div>
          <Navigation />
          <Container>
            <Row>
              <Col sm={{ size: 6, order: 2, offset: 1 }}>
                <Stock />
              </Col>
            </Row>
          </Container>
      </div>
  );
}

export function Stock() {
  const url = "http://131.181.190.87:3000/stocks/symbols"
  const [rowData, setRowData] = useState([]);
  const [filterData, setFilterData] = useState();
  const [error, setError] = useState();
  
  const columns = [
    { headerName: "Name", field: "name", width: "300", resizable: true },
    { headerName: "Symbol", field: "symbol", resizable: true },
    { headerName: "Industry", field: "industry", resizable: true }
  ];

  /*The find() function sends a GET request to the API with the required symbol and date parameters
  obtained from the form. First the status of the response from the API is checked against a switch
  statement. If an error response is returned, an errormessage will be saved in the error useState 
  and displayed to the user. If a 200 response is returned, that response will be processed. */
  useEffect(() => {
    fetch(url)
      .then((response) => {
        let status = response.status;
        switch (status) {
            case 200:
                return response.json();
            case 400:
                console.log("Error 400")
                setError("Invalid query parameter: only 'industry' is permitted")
                break;
            case 404:
                console.log("Error 404")
                setError("Industry sector not found")
                break;
            default:
                console.log("Unspecificed error")
                setError("Unspecified error")
                break;
        }
        throw new Error(`Network response with status ${status}`);
      })
      /*The result from the API is mapped to a stock array. This stocks array is then passed to the addData function*/
      .then((result) => 
        result.map(stock => {
          return {
            name: stock.name,
            symbol: stock.symbol,
            industry: stock.industry,
          };
        })
      )
      .then((stocks) => {
        addData(stocks)
      })
    }, []);
  
  /*The stocks array is saved to filterData and rowData*/
  async function addData(value) {
    setFilterData(value)
    setRowData(value)
  }

  /*When the select input is changed, the value from the chosen select option is passed
  to the onFilter function. The value stored in the 'Select an industry' option is "" so
  when chosen, entries from all industries are displayed. For the other options, the value
  is used to filter the rowData. The result is then saved to filterArray which is then 
  saved to filterData. This is displayed in agGrid table*/
  async function onFilter(value) {
    if (value === "") {
      setFilterData(rowData)
    } else {
      let filterArray = (rowData.filter(rowData => rowData.industry === value))
      await setFilterData(filterArray)
    }
  }

  return (
    <div className="container">
      <br/>
      <h1>All Stocks</h1>
      <p className="text-secondary">Search all stocks by industry</p>
      {error != null ? <Alert color="danger">{error}</Alert> : <br/>}
      <p><Badge color="success">{rowData.length}</Badge> Stocks</p>
      <InputGroup style={{ width: "500px"}}>
        <Input type="select" name="select" id="filter"
          onChange={event => {
            const { value } = event.target; 
            onFilter(value)
          }}>
          <option value="">Select an industry</option>
          <option value="Health Care">Health Care</option>
          <option value="Industrials">Industrials</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Consumer Staples">Consumer Staples</option>
          <option value="Utilities">Utilities</option>
          <option value="Financials">Financials</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Materials">Materials</option>
          <option value="Energy">Energy</option>
          <option value="Telecommunication Services">Telecommunication Services</option>
        </Input>
      </InputGroup>
      <br/>
      <div className="ag-theme-balham"
        style={{
          height: "250px",
          width: "700px"
        }}
      >
        <AgGridReact
          rowModelType="clientSide"
          columnDefs={columns}
          rowData={filterData}
          enableColResize={true}
          pagination={true}
          paginationPageSize={6}
        />
      </div>
    </div>
  )
}