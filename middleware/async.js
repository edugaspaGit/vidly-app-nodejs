
module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            //res.status(500).send('Something failed.'); logic goes to error.js
            next(ex);
        }
    }
}