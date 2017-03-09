const URL = require('url');
const https = require('https');
const http = require('http');

/*
 * Makes basic node http/https requests into promises and a whole lot
 * easier to handle because of it!
 *
 * httpsOptions is used only if the protocol is https (of course). If
 * the options contain key and/or cert then a new https agent is created
 * to handle the request.
 *
 * Returns a promise that resolves with an object containing the following properties:
 *	
 *		statusCode:	obvious - but note that ALL stati are returned, even 500s
 *		statusMessage: equally obvious
 *		headers:	again, obvious
 *		body:		a Buffer containing the body bytes, or null if there was no body
 */

const requiresNewAgent = {
	key: true,
	cert: true
}

module.exports = function(method, url, headers, requestBody, httpsOptions) {

	/*
	 * Create a promise out of the request
	 */
	return new Promise(function(resolve, reject) {
		/*
		 * Use the parsed URL as the basic options object
		 */
		const options = URL.parse(url);

		/*
		 * HTTPS has some special handling
		 */
		var isHttps = (options.protocol.toLowerCase() == 'https:')

		/*
		 * Use the right library
		 */ 
		const lib = isHttps ? https : http;

		/*
		 * Complete the options object
		 */
		options.method = method;
		if (headers)
			options.headers = headers;

		if (isHttps && httpsOptions) {
			/*
			 * Include certificates and other https options
			 */
			var newAgentRequired = false;
			for (key in httpsOptions) {
				options[key] = httpsOptions[key]
				newAgentRequired = (newAgentRequired || requiresNewAgent[key]);
			}
			if (newAgentRequired) {
				/*
				 * We need a separate agent
				 */
				if (options.port === null) options.port = 443;
				options.agent = new https.Agent(options);
			}
		}

		/*
		 * Create the request
		 */
		const request = lib.request(options, function(response) {
			/*
			 *  Response buffer
			 */
			var responseBody = new Buffer(0);;

			/*
			 * Add each chuck to the buffer
			 */
			response.on('data', function(chunk) {
				responseBody = Buffer.concat([responseBody, chunk], responseBody.length + chunk.length);
			});

			/*
			 * Construct the response object and resolve with it.
			 */
			response.on('end', function() {
				resolve({
					statusCode: response.statusCode,
					statusMessage: response.statusMessage,
					headers: response.headers,
					body: responseBody.length > 0 ? responseBody : null
				});
			});
		});

		/*
		 * If there's a request biody, throw it out there
		 */
		if (requestBody)
			request.write(requestBody);
		
		/*
		 * Reject on errors
		 */
		request.on('error', function(err) { reject(err) })

		/*
		 * And get the whole thing going
		 */
		request.end();
	})
};
