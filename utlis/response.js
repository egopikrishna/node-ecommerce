export const sendRsp = (res, statusCode, message, response = {}, errMsg = {}) => {

    let errorType = false;
    let status = 'success';

    if(statusCode !== 200 && statusCode !== 201) {
        errorType = true;
        status = 'error';
    } else if(statusCode === 500) {
        errorType = true;
        status = 'error';
        console.log('Error :: ', errMsg);
    } else if(statusCode === 422) {
        status = 'error';
        errorType = errMsg
    }

    res.status(statusCode);
    res.send({
        statusCode,
        message,
        status,
        response,
        error: errMsg
    });
};
