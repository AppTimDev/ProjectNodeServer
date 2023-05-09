//check parameter
function validatePost(req, res, next, id) {
    console.log(`validatePost id: ${id}`);
    req.id = id;
    next();
}


module.exports = {
    validatePost
};