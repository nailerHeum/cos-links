import { hot } from "react-hot-loader";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App.jsx";

const Hot = hot(module)(App);
ReactDOM.render(<Hot />, document.querySelector("#root"));
