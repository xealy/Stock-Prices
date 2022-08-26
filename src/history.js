import React, { useState } from "react";
import { Navigation } from "./navigation";
import {
    Container,
    Row,
    Alert,
    Input,
    Badge,
    Button,
    InputGroup, 
    InputGroupAddon,
    Form,
    FormGroup,
    Label,
    Col
} from 'reactstrap';
import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import { Line } from 'react-chartjs-2';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function HistoryApp() {
  return (
      <div>
          <Navigation />
          <Container>
            <Row>
              <History />
            </Row>
          </Container>
      </div>
  );
}

export function History() {
  const [rowData, setRowData] = useState([]); //useState for table data
  const [xAxis, setXAxis] = useState([]); //useState for chart data
  const [yAxis, setYAxis] = useState([]); //useState for chart data
  const [symbols, setSymbols] = useState(); //useState for symbol parameter
  const [fromDate, setFromDate] = useState(); //useState for date parameters
  const [toDate, setToDate] = useState(); //useState for date parameters
  const [error, setError] = useState(null);
  
  /*Column definitions for agGrid table*/
  const columns = [
    { headerName: "Timestamp", field: "timestamp", width: "160", resizable: true },
    { headerName: "Symbol", field: "symbol", width: "100", resizable: true },
    { headerName: "Name", field: "name", width: "160", resizable: true  },
    { headerName: "Industry", field: "industry", width: "120", resizable: true  },
    { headerName: "Open", field: "open", width: "100", resizable: true  },
    { headerName: "High", field: "high", width: "100", resizable: true  },
    { headerName: "Low", field: "low", width: "100", resizable: true  },
    { headerName: "Close", field: "close", width: "100", resizable: true  },
    { headerName: "Volumes", field: "volumes", width: "120", resizable: true  }
  ];

  /*variable to initialise table properties*/
  const state = {
    labels: yAxis,
    datasets: [
      {
        label: 'Stock Price ($)',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(0,0,0,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: xAxis
      }
    ]
  }

  /*Login token is saved into a variable to be used in Authorization header*/
  const token = localStorage.getItem("token");
  const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
  }

  /*If login token doesn't exist user will see this HTML*/
  /*Otherwise user will see the Price History interface*/
  /*The find() function sends a GET request to the API with the required symbol and date parameters
    obtained from the form. First the status of the response from the API is checked against a switch
    statement. If an error response is returned, an errormessage will be saved in the error useState 
    and displayed to the user. If a 200 response is returned, that response will be processed. */
    /*The result from the API is mapped to a stock array. Here, the timestamp is modified to
    remove the time, leaving only a simple date. The rowData is set to this new array*/

  if (localStorage.getItem("token") === null) {
    return (
        <div className="container">
          <h1>Please login to see price history</h1>
        </div>
      )
  } else {
    function find(){
        fetch(`http://131.181.190.87:3000/stocks/authed/${symbols}?from=${fromDate}&to=${toDate}`, { headers })
        .then((response) => {
          let status = response.status;
          switch (status) {
              case 200:
                  return response.json();
              case 400:
                  setError('Invalid symbol or date format')
                  break;
              case 403:
                  setError('Authorization header not found')
                  break;
              case 404:
                  setError('No entries available for query symbol for this date range')
                  break;
              default:
                  setError('unspecified')
                  break;
          }
      })
      .then((result) => 
        result.map(stock => {
          return {
              timestamp: new Date(stock.timestamp).toISOString().split('T', 1)[0],
              symbol: stock.symbol,
              name: stock.name,
              industry: stock.industry,
              open: stock.open,
              high: stock.high,
              low: stock.low,
              close: stock.close,
              volumes: stock.volumes,
          };
        })
      )
      .then((stocks) => {
        setRowData(stocks);
        setError(null)
      })
      .catch((error) => {
        console.log(error)
      });
    }

    /*When the update chart button is clicked, new arrays from the y and x axis of the chart
    are created. The rowData is looped through to push only the timestamp and closing price 
    data into the y axis and x axis arrays respectively. These arrays are then set to the  
    yAxis and xAxis useStates*/
    async function chart() {
      let newY = [];
      let newX = [];
      for (var yKey of Object.keys(rowData)) {
        newY.unshift(rowData[yKey].timestamp)
      }
      setYAxis(newY)
      for (var xKey of Object.keys(rowData)) {
        newX.unshift(rowData[xKey].close)
      }
      setXAxis(newX)
    }

    /*Once all required parameters are inputted, clicked the search button will executed the find() function*/
    /*Once yAxis and xAxis useStates contain data, this data will be displayed on the chart when the update
    chart button is clicked */
    /*Once yAxis and xAxis useStates contain data, this data will be displayed on the chart when the update
    chart button is clicked */
    return (
        <div className="container">
          <Row>
          <Col md="6">
          <h1>Price History</h1>
          <p className="text-secondary">Chart the trend of a stock by providing a date interval</p>
          {error != null ? <Alert color="danger">{error}</Alert> : null}
          <p><Badge color="success">{rowData.length}</Badge> Stocks</p>
              <Form>
                <Row form>
                <Col md={5}>
                <FormGroup>
                    <InputGroup style={{ width: "400px"}}>
                        <Input type="text" name="symbols" id="symbols" placeholder="Search by symbol" value={symbols}
                        onChange={event => {
                            const { value } = event.target; 
                            setSymbols(value);
                        }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button color="secondary" onClick={find}><FontAwesomeIcon icon={faSearch} /></Button>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append">
                          <Button color="info" onClick={chart}>Update Chart</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
                </Col>
                </Row>
                <Row form>
                  <Col md={6}>
                    <FormGroup style={{ width: "220px"}}>
                      <Label for="fromDate" sm={2}>From:</Label>
                      <Input type="date" name="date" id="fromDate" placeholder="date placeholder"
                        onChange={event => {
                          const { value } = event.target; 
                          setFromDate(value);
                          console.log(fromDate)
                        }}
                        /> 
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup style={{ width: "220px"}}>
                      <Label for="toDate" sm={2}>To:</Label>
                      <Input type="date" name="date" id="toDate" placeholder="date placeholder"
                        onChange={event => {
                          const { value } = event.target; 
                          setToDate(value);
                          console.log(toDate)
                        }}
                        /> 
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col md={6}>
          <div>
            <Line data={state}
                  options={{
                    title:{
                      display:true,
                      text:'Price History',
                      fontSize: 20,
                      bezierCurve : false
                    },
                    legend:{
                      display:true,
                      position:'right'
                    }
                  }}
                />
            </div>
        </Col>
          </Row>
          
          <Row>
          <div className="ag-theme-balham"
              style={{
              height: "250px",
              width: "1100px"
              }}
          >
              <AgGridReact
              columnDefs={columns}
              rowData={rowData}
              pagination={true}
              paginationPageSize={7}
              />
          </div>
          </Row>
        </div>
    )
    }
}