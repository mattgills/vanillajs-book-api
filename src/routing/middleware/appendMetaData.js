module.exports = function(req, res, next) {
    res.body.metadata = {
        language: 'JavaScript',
        framework: 'Express with Vanilla JavaScript'
    }

    res.send(res.body);
}