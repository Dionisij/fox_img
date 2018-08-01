import React from 'react';

const progressBar = (props) => (
    <div className="App-progress-bar">
        <div className="App-filler" style={{ width: `${props.percentage}%`}}></div>
    </div>
);

export default progressBar;