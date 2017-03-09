yet-another-simple-request
==========================

Yet another module that claims to make basic node http requests simple and then-able.

## Prereqs
None

## Installation
```bash
npm install yet-another-simple-request
```

## usage
```javascript
const yasr = require('yet-another-simple-request')

yasr(method, url, headers, body, httpsOptions).then(
    function(response) {
        /*
         * response.statusCode    contains the status code - ALL stati are returned
         * response.statusMessage contains the status message
         * response.headers       contains the response headers in an object
         * response.body          contains a Buffer holding the response bytes
         */
	}
).catch(
    function(error) {
        /*
         * Only real errors thrown by the base request object get rejected.
         * In particular, 500 status codes are resolved, not thrown
         */
    }
);
```

The request arguments are fairly obvious, but for clarity:

* `method`: REQUIRED - the HTTP method
* `url`: REQUIRED - the full request URL including protocol, server, port, path, and query parameters
* `headers`: OPTIONAL - headers that must accompany the request, as an object where the property name 
are the header names, and their values are ... you get it I'm sure.
* `body`: OPTIONAL - any body that should accompany the request. [HTTP/2 clarifications](http://httpwg.org/specs/) 
to HTTP allow every request to have a body, though for GET, HEAD, DELETE and OPTIONS the behaviour is undefined and the practice frowned upon!
* `httpsOptions`: OPTIONAL - options that will be added to https requests, including `cert`, `key`, `rejectUnauthorized` 
and the like. Specifying `cert` or `key` causes a new HttpAgent to be created
to handle these options - but you probably don't need to know that.

## Notes

* This is facile and I'm sure there are a hundred others out there - but I like it :)
* There is a stunning lack of tests - I promise to rectify that!

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. That said, my own style is rather old-school, so any improvements that retain functionality are more than welcome.

Add unit tests for any new or changed functionality. Lint and test your code - some of which I've not been particularly careful to observe in these early releases! 

## Release History

* 1.0.0 Initial release
