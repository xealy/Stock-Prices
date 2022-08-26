import React from "react";
import "./styles.css";
import { LoginApp } from "./login";
import { RegisterApp } from "./register";
import { StockApp } from "./stock";
import { QuoteApp } from "./quote";
import { HistoryApp } from "./history";
import { RootApp } from "./root";
import { BrowserRouter, Route, Switch } from "react-router-dom";

/*React Router DOM used to link different components to url links*/
export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginApp} />
          <Route path="/register" component={RegisterApp} />
          <Route path="/stock" component={StockApp} />
          <Route path="/quote" component={QuoteApp} />
          <Route path="/history" component={HistoryApp} />
          <Route path="/" component={RootApp} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}