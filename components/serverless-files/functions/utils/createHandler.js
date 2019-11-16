/**
 * We need to respond with adequate CORS headers.
 * @type {{"Access-Control-Allow-Origin": string, "Access-Control-Allow-Credentials": boolean}}
 */
const baseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
};

module.exports = handler => async event => {
    if (event.httpMethod === "OPTIONS") {
        return {
            body: "",
            statusCode: 204,
            headers: baseHeaders
        };
    }

    try {
        const { data, statusCode, headers = {} } = await handler(event);
        const isBuffer = Buffer.isBuffer(data);
        let body = isBuffer
            ? data.toString("base64")
            : JSON.stringify({
                  error: false,
                  data,
                  message: null
              });

        return {
            isBase64Encoded: isBuffer,
            statusCode: statusCode || 200,
            headers: { ...baseHeaders, ...headers },
            body
        };
    } catch (e) {
        return {
            statusCode: 500,
            headers: baseHeaders,
            body: JSON.stringify({
                error: true,
                data: null,
                message: e.message
            })
        };
    }
};
