const minimatch = require("minimatch");

function validate(labels, globs) {
    const matches = globs.map(glob => minimatch.match(labels, glob, { nocase: true }))
    // if an item doesn't match, it will be returned as an empty array
    return !matches.flatMap(item => item.length).includes(0)
}

module.exports = validate;