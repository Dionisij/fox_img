import React from 'react';

const imageHolder = (props) => {

    return (
        <React.Fragment>
            <img src={props.src} alt="stitched"/>
            <a className="App-download" download="cool_pic.png" href={props.src}>Download</a>
        </React.Fragment>
        
    );
}

export default imageHolder;