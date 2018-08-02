import axios from 'axios';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import Header from './components/Header';
import ImageHolder from './components/ImageHolder';
import ManualUpload from './components/ManualUpload';
import Message from './components/Message';
import Output from './components/Output.jsx';
import ProgressBar from './components/ProgressBar';
import SelectedFiles from './components/SelectedFiles';
import { validateAndFilterSelectedFiles } from './validation/imgValidation';

class App extends Component {

    state = {
        selectedFiles: [],
        image: '',
        showOutput: false,
        message: '',
        percentage: 0
    }

    // update state on file select
    fileSelectHandler = event => {

        if (event.target.files && event.target.files.length > 1) {

            // let files = []; for (let i = 0; i < event.target.files.length; i++) {
            // files.push(event.target.files[i]); }

            validateAndFilterSelectedFiles(event.target.files).then((res) => {
                console.log('app res', res);

                let files = [];
                for (let i = 0; i < res.length; i++) {
                    // filter all unsupported
                    if (res[i]) {
                        files.push(res[i]);
                    }

                }

                if (files && files.length > 1) {
                    this.setState({
                        ...this.state,
                        selectedFiles: files,
                        showOutput: true,
                        image: '',
                        message: ''
                    });
                } else {
                    const message = 'Please select more then 2 images.';

                    this.setState({
                        ...this.state,
                        selectedFiles: [],
                        image: '',
                        message: message
                    });
                }

            }).catch(err => {
                console.log(err);
            });

        } else {

            const message = 'Please select 2 or more files.';

            this.setState({
                ...this.state,
                selectedFiles: [],
                image: '',
                message: message
            });
        }

    }

    fileUploadHandler = () => {

        if (this.state.selectedFiles && this.state.selectedFiles.length > 1) {

            const fd = new FormData();
            for (const pic of this.state.selectedFiles) {
                fd.append('images[]', pic, pic.name);
            }

            axios.post('http://localhost:3030/upload', fd, {
                // progress bar filler
                onUploadProgress: progressEvent => {
                    this.setState({
                        ...this.state,
                        selectedFiles: [...this.state.selectedFiles],
                        percentage: Math.round(progressEvent.loaded / progressEvent.total * 100)
                    });
                }
            }).then(res => {

                if (res && res.data && res.data.image) {

                    this.setState({
                        ...this.state,
                        selectedFiles: [...this.state.selectedFiles],
                        image: res.data.image,
                        showOutput: false,
                        message: '',
                        percentage: 0
                    });

                }

            }).catch(error => {
                this.setState({
                    ...this.state,
                    selectedFiles: [...this.state.selectedFiles],
                    message: error.response.data.message,
                    percentage: 0
                });
            });
        } else {
            const message = 'Please select files.';

            this.setState({
                ...this.state,
                selectedFiles: [...this.state.selectedFiles],
                message: message
            });
        }

    }

    // drop images handler
    onImageDrop(droppedFiles) {

        if (droppedFiles && droppedFiles.length > 1) {

            let files = [];

            for (let i = 0; i < droppedFiles.length; i++) {
                files.push(droppedFiles[i]);
            }

            this.setState({
                ...this.state,
                selectedFiles: files,
                showOutput: true,
                image: '',
                message: ''
            });

        } else {

            const message = 'Please select more then 2 images.';

            this.setState({
                ...this.state,
                selectedFiles: [],
                image: '',
                message: message
            });
        }

    }

    render() {

        // selected files to show
        const outputArr = this.state.selectedFiles.map(file => {
                return (
                    <Output key={file.name} fileType={file.type} fileSize={file.size}>{file.name}</Output>
                )
            });

        return (
            <div className="App">
                <Header>Stitch Images App</Header>

                <ProgressBar percentage={this.state.percentage}/>

                <ManualUpload
                    type="file"
                    inputName="files[]"
                    multiple
                    changeHandler={this.fileSelectHandler.bind(this)}
                    clickHandler={this.fileUploadHandler.bind(this)}/>

                <Dropzone
                    className="App-drop"
                    multiple={true}
                    accept="image/*"
                    onDrop={this.onImageDrop.bind(this)}>
                    <p>Drop an image or click to select a file to upload.</p>
                </Dropzone>

                <Message>{this.state.message}</Message>

                {this.state.showOutput
                    ? <SelectedFiles>{outputArr}</SelectedFiles>
                    : null}

                {this.state.image
                    ? <ImageHolder src={this.state.image}/>
                    : null}

            </div>
        );
    }
}

export default App;
