import React, { useState } from "react";
import { Navigation } from "./navigation";
import {
    Alert,
    Container,
    Row,
    Col,
    Input,
    Badge,
    Button,
    InputGroup, 
    InputGroupAddon
} from 'reactstrap';
import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import { Line } from 'react-chartjs-2';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function QuoteApp() {
  return (
      <div>
          <Navigation />
          <Container>
            <Row>
              <Quote />
            </Row>
          </Container>
      </div>
  );
}

export function Quote() {
  const [rowData, setRowData] = useState([]);
  const [symbols, setSymbols] = useState();
  const [error, setError] = useState();
  const [xAxis, setXAxis] = useState([]); //useState for chart data

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

  const state = {
    labels: ["Open", "High", "Low", "Close"],
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

  /*The find() function sends a GET request to the API with the required symbol parameter obtained 
    from the form. If the result from the request is an error, the error message will be set to the
    error useState and will be dislayed to the user. If result returns stock data, the result and
    setRowData useState are passed to the addData() function and the error is set to null*/
 function quote(){
    fetch(`http://131.181.190.87:3000/stocks/${symbols}`)
    .then((response) => response.json())
    .then((result) => {
      if ('error' in result) {
        console.log(result.message)
        setError(result.message)
      } else {
        addData(result, setRowData)
        setError(null)
      }
    });
};

/*The addData pushes the result from the GET request into an array as agGrid on processes
data given as arrays. The timestamp is also modified to remove the time to leave a simple date.
The rowData is set to this array*/
function addData(contents, setRowData) {
    let newData = [];
    newData.push(contents);
    newData[0].timestamp = new Date(newData[0].timestamp).toISOString().split('T', 1)[0]
    setRowData(newData);
}

/*When the update chart button is clicked, new arrays from the x axis of the chart
are created. The rowData is looped through to push only the closing, low, high and opening
price data into the x axis array. These arrays are then set to the xAxis useState*/
async function chart() {
  let newX = [];
  for (var yKey of Object.keys(rowData)) {
    newX.unshift(rowData[yKey].close)
    newX.unshift(rowData[yKey].low)
    newX.unshift(rowData[yKey].high)
    newX.unshift(rowData[yKey].open)
  }
  setXAxis(newX)
}

  return (
    <div className="container">
      <br/>
      <Row>
      <Col md={5}>
      <h1>Get a quote</h1>
      <p className="text-secondary">Find quote for a specific stock by symbol</p>
      {error != null ? <Alert color="danger">{error}</Alert> : <br/>}
      <p><Badge color="success">{rowData.length}</Badge> Quotes</p>
        <InputGroup style={{ width: "400px"}}>
            <Input type="text" name="symbols" id="symbols" placeholder="Search by symbol" value={symbols}
              onChange={event => {
                const { value } = event.target; 
                setSymbols(value);
              }}
            />
            <InputGroupAddon addonType="append">
              <Button color="secondary" onClick={quote}><FontAwesomeIcon icon={faSearch} /></Button>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <Button color="info" onClick={chart}>Update Chart</Button>
            </InputGroupAddon>
        </InputGroup>
      </Col>  
      <Col md={1}></Col>     
      <Col md={6}>
        <div>
            <Line data={state}
                  options={{
                    title:{
                      display:true,
                      drawBorder:true,
                      text:'Variation over day',
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
      <br/>
      <br/>
      <div className="ag-theme-balham"
        style={{
          height: "200px",
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
    </div>
  )
}