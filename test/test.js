(function() {
    var simple = require("../index"),
        assert = require("assert");

    console.log("Requesting instance..");

    simple.request("ibobrik@gmail.com", {connect_timeout: 1000, max_attempts: 1}, function(error, client, info) {
        assert.ifError(error);

        console.log("Checking instance..");

        client.set("x", Math.PI, function(error) {
            assert.ifError(error);

            client.get("x", function(error, x) {
                assert.ifError(error);
                assert.equal(x, Math.PI);

                console.log("All good! Finishing up..");

                client.on("end", function() {
                    console.log("Redis connection terminated!");

                    simple.terminate(info.id, function(error) {
                        assert.ifError(error);

                        console.log("Instance terminated!");
                    });
                });

                client.quit();
            });
        });
    });
})();
