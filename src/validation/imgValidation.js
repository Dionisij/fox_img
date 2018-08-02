export const validateAndFilterSelectedFiles = (blobArr) => {

    let promiseArr = [];

    // for each selected image check 4 first bytes to filter images from other files 
    for (let i = 0; i < blobArr.length; i++) {
        const file = blobArr[i];

        // create array of Promises with value evaluated in .onload
        promiseArr.push(new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = function (e) {

                let arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                let header = "";

                for (let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }

                // if file supported IMAGE add to array
                if (determineMIMEType(header)) {
                    resolve(file);
                }

                // if not supported add false
                resolve(false);
            }


            reader.readAsArrayBuffer(file);

            reader.onerror = (error) => {
                reject(error);
            }

        }));

    }

    return Promise.all(promiseArr);

};

const determineMIMEType = header => {

    let supportedImageType = true;

    switch (header) {
        case "89504e47":
            //type = "image/png";
            break;
        case "47494638":
            //type = "image/gif";
            break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
            //type = "image/jpeg";
            break;
        default:
            //type = "unknown"; // Or you can use the blob.type as fallback
            supportedImageType = false;
            break;
    }

    return supportedImageType;
};