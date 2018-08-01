import React from 'react';

const selectedFiles = (props) => (
    <div className="App-output">
        <h3>Review selected files</h3>
        {props.children}
    </div>
);

export default selectedFiles;