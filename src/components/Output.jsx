import React from 'react';

const output = (props) => {
    return (
        <p><b>{props.children}</b> - {props.fileType} - {props.fileSize}</p>
    );
}

export default output;