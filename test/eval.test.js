const {evaluate} = require("../utils/evaluate");


// Example usage:
const jsText = `
    const fetchData = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('Hello, World!');
            }, 1000);
        });
    };
    const result = await fetchData();
    return result === 'Hello, World!';
`;

const syncText = `
    const result = 'await fetchData()';
    return result !== 'Hello, World!';
`;


const expectedResult = 'Hello, World!';

async function evalTest() {
    try {
        const result = await evaluate(jsText);
        console.log(result);
    } catch (e) {
        console.error(e);
    }
}

evalTest().then();