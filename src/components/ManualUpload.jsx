import React from 'react';
import Button from './Button';

const manualUpload = (props) => (

    <React.Fragment>
        <input style={{display: 'none'}}
            type={props.type}
            name={props.inputName}
            multiple={props.multiple}
            onChange={props.changeHandler}
            ref={fileInput => this.fileInput = fileInput}/>

        <Button clickHandler={() => this.fileInput.click()}>Choose files</Button>
        <Button clickHandler={props.clickHandler}>Upload</Button>
    </React.Fragment>

);

export default manualUpload;