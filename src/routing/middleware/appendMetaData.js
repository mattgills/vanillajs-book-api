module.exports = function(req, res, next) {
    res.locals.body.metadata = {
        language: 'JavaScript',
        framework: 'Express with Vanilla JavaScript'
    }

    res.send(res.locals.body);
}