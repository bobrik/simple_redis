simple_redis
====

Get your free redis instance from [SIMPLE:REDIS](http://console.simpleredis.com/) in node.js!
This is not for production use, mostly for testing. Please go to http://console.simpleredis.com/
to learn more and request your first instance to confirm your email.

### Installation

```
npm install simple_redis
```

### Usage

```javascript
var simple = require("simple_redis");

// request instance
simple.request("me@example.com", {connect_timeout: 1000}, function(error, client, info) {
    if (error) {
        throw error;
    }

    // do what you need
    client.set("pi", Math.PI);
    client.quit();

    // terminate instance when you're done
    simple.terminate(info.id);
});
```

### API

* Requiring

    ```javascript
    var simple = require("simple_redis");
    ```

* Requesting instance

    ```javascript
    simple.request(email, redis_client_options, callback);
    simple.request(email, callback);
    ```

    You will receive `error` (error if any), `client` (redis client) and `info` (object with redis info) in callback.

* Terminating instance

    ```javascript
    simple.terminate(id, callback);
    simple.terminate(id);
    ```

    You can get `id` from the thind argument of `callback` in `simple.request`.

### Authors

* [Ian Babrou](https://github.com/bobrik)
