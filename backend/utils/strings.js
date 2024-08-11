const variables = require("./request");


function replaceVariables(template, variables) {
    return template ? template.replace(/\${(.*?)}/g, (match, variable) => variables.get(variable)) : '';
}

function replaceVariable(template, name, value) {
    return template ? template.replace(/\${(.*?)}/g, (match, variable) => name === variable ? value : variable) : '';
}

module.exports = {replaceVariables, replaceVariable}