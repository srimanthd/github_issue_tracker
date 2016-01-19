var express = require('express');
var request = require('request');

var router = express.Router();
var numberOfIssues = 0;

router.get('/', function(req, res, next) {
    res.render('tracker');
});

// function which sends the request to get the total number of issues
router.post('/getNumberOfIssues', function(req, res, next) {

    // preparing the request line
    var api_query = req.body.link + "?page=" + req.body.page + "&per_page=" + req.body.per_page + "&state=" + req.body.state;

    // to prevent the rate limit issues using client_id and client_secret parameters
    api_query = api_query + "&client_id=64acceafbdcd0595fc02&client_secret=c963286f95bfa57f0bf4e344d16f8f0790a69c09"

    // user agent needs to be specified
    var api_query_final = {
        url: api_query,
        headers: {
            'User-Agent': req.body.user
        }
    };

    // sending the request
    request(api_query_final, function(error, response, body) {

        var jsonBody = JSON.parse(body);
        var numberOfIssues = jsonBody.length;

        if (!error && numberOfIssues != 0 && !(jsonBody[0] == undefined)) {
            // since we recieve the latest issues we can obtain the number which will be the total number of issues
            res.send("" + jsonBody[0].number);
        } else {
            res.send("There are no issues for this github project or repository does not exist");
        };

    });

});

router.post('/getIssues', function(req, res, next) {

    // preparing the request line with incremental page parameters
    var api_query = req.body.link + "?page=" + req.body.page + "&per_page=" + req.body.per_page + "&state=" + req.body.state;

    // to prevent the rate limit issues using client_id and client_secret parameters
    api_query = api_query + "&client_id=64acceafbdcd0595fc02&client_secret=c963286f95bfa57f0bf4e344d16f8f0790a69c09"

    // user agent needs to be specified
    var api_query_final = {
        url: api_query,
        headers: {
            'User-Agent': req.body.user
        }
    };

    // sending the request
    request(api_query_final, function(error, response, body) {

        var jsonBody = JSON.parse(body);

        if (!error) {
			// sending the issues array to the client
            res.send(jsonBody);
        } else {
            res.send("There is some technical issue");
        };

    });

});

module.exports = router;