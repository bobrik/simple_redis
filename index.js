(function(module) {
    var http  = require("http"),
        qs    = require("querystring"),
        redis = require("redis");

    function request(email, options, callback) {
        var req, body, headers;

        if (typeof options == "function") {
            callback = options;
            options  = undefined;
        }

        body    = qs.stringify({email: email});
        headers = {
            "Content-Length" : Buffer.byteLength(body),
            "Content-Type"   : "application/x-www-form-urlencoded"
        };

        api("/v1/instances", "POST", headers, body, 201, function(error, instance) {
            if (!instance.id) {
                callback(new Error("Got strange response: " + data));
                return;
            }

            client = redis.createClient(instance.port, instance.host, options);

            client.on("error", function(error) {
                if (!good) {
                    callback(error);
                }
            });

            client.on("ready", function() {
                good = true;
            });

            client.auth(instance.id, function(error) {
                if (error) {
                    callback(error);
                    return;
                }

                callback(undefined, client, instance, instance);
            });
        });
    }

    function terminate(id, callback) {
        if (!callback) {
            callback = function() {};
        }

        api("/v1/instances/" + id, "DELETE", undefined, undefined, 200, function(error, instance) {
            if (error) {
                callback(error);
                return;
            }

            if (!instance.terminated) {
                callback(new Error("Not terminated: " + JSON.stringify(instance)));
                return;
            }

            callback(undefined, instance);
        });
    }

    function api(path, method, headers, body, expectedCode, callback) {
        var req;

        req = http.request({
            host    : "api.simpleredis.com",
            path    : path,
            method  : method,
            headers : headers
        });

        req.once("error", callback);

        req.on("response", function(res) {
            var data = "";

            res.once("error", callback);

            res.on("data", function(chunk) {
                data += chunk.toString();
            });

            res.on("end", function() {
                var response;

                if (res.statusCode != expectedCode) {
                    callback(new Error("Got " + res.statusCode + ": " + data));
                    return;
                }

                try {
                    response = JSON.parse(data);
                } catch (error) {
                    callback(error);
                    return;
                }

                callback(undefined, response);
            });
        });

        req.end(body);
    }

    module.exports.request   = request;
    module.exports.terminate = terminate;
})(module);
