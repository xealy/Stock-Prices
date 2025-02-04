# Stock Prices
## About
'Stock Prices' is a React-based web application that serves as an interface for a stocks database, enabling users to view and analyse stock market data. It interacts with a REST API to retrieve data from the database and submit information such as login and registration details. Non-logged-in users can access a table displaying stocks from various companies, which can be filtered by industry. Users can also search for specific stock prices by entering the stock's symbol. Additionally, they can generate a visual representation of the price fluctuations for a selected stock. Logged-in users gain access to the price history feature, which allows them to view the price changes of a specific stock over a given date range by inputting the stock’s symbol and selecting two dates. They can also visualize the price history graphically.

To ensure a clean and visually appealing user interface, several modules were integrated into the application. Ag-Grid, a JavaScript data grid, was used to display the stock data in table form, which eliminates the need to manually create tables in HTML and enhances efficiency. Reactstrap, a module containing pre-built Bootstrap 4 components, was incorporated for responsive design and easy element placement using grids. Finally, ChartJS, a JavaScript library for data visualisation, was used to generate graphical representations of stock price data.

## How to Run
* Install NPM packages: npm install
* Run application in browser: npm start

**NOTE**: The API no longer works with the application

## Demo Video
https://github.com/user-attachments/assets/a7667c58-b3e2-4cdd-a102-422a277d1670

