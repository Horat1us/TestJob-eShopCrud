import "bootstrap-loader";
import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";

$(document).ready(() => {
    "use strict";

    ReactDOM.render(
        <App />,
        document.getElementById('react-container')
    );
});