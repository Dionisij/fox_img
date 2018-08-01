const express = require('express');
const fileUpload = require('express-fileupload');
const mergeImg = require('merge-img');
const cors = require('cors');
const Jimp = require('jimp');

const app = express();
app.use(cors());
app.use(fileUpload());


app.route('/upload')
    .post((req, res, next) => {

        try {

            let err = '';

            if (!req.files) {
                err = new Error('No files were provided.');
                err.status = 400;
                return next(err);
            } 

            // create array of buffers
            let imgBuffersArray = [];
            for (const pic of req.files['images[]']) {
                imgBuffersArray.push(pic.data);
            }

            // merge images
            mergeImg(imgBuffersArray)
                .then((img) => {

                    img.getBase64(Jimp.AUTO, (err, buffer) => {
                        if (err) {
                            return next(err);
                        } else {
                            return res.status(200).json({
                                image: buffer
                            });
                        }
                    });

                })
                .catch((err) => {
                    return next(err);
                });

        } catch (err) {
            return next(err);
        }

    });


// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// create server and listen on port
const server = app.listen(3030, function () {
    console.log('Listening on port %d', server.address().port);
});