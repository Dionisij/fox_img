import React from 'react';

const button = (props) => (
    <button className="App-button" onClick={props.clickHandler}>{props.children}</button>
);

export default button;