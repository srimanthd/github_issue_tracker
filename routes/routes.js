var express = require('express');
var request = require('request');

var router = express.Router();
var numberOfIssues = 0;

router.get('/', function(req, res, next) {
    res.render('tracker');
});

router.post('/getNumberOfIssues', function(req, res, next) {

    var api_query = req.body.link + "?page=" + req.body.page + "&per_page=" + req.body.per_page + "&state=" + req.body.state;
    api_query = api_query + "&client_id=64acceafbdcd0595fc02&client_secret=c963286f95bfa57f0bf4e344d16f8f0790a69c09"
    var api_query_final = {
        url: api_query,
        headers: {
            'User-Agent': req.body.user
        }
    };

    request(api_query_final, function(error, response, body) {

        var jsonBody = JSON.parse(body);
        var numberOfIssues = jsonBody.length;

        if (!error && numberOfIssues != 0 && !(jsonBody[0] == undefined)) {
            res.send("" + jsonBody[0].number);
        } else {
            res.send("There are no issues for this github project or repository does not exist");
        };

    });

});

router.post('/getIssues', function(req, res, next) {

    var api_query = req.body.link + "?page=" + req.body.page + "&per_page=" + req.body.per_page + "&state=" + req.body.state;
    api_query = api_query + "&client_id=64acceafbdcd0595fc02&client_secret=c963286f95bfa57f0bf4e344d16f8f0790a69c09"
    var api_query_final = {
        url: api_query,
        headers: {
            'User-Agent': req.body.user
        }
    };

    request(api_query_final, function(error, response, body) {

        var jsonBody = JSON.parse(body);

        if (!error) {
            res.send(jsonBody);
        } else {
            res.send("There is some technical issue");
        };

    });

});

module.exports = router;