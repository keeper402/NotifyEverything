async function evaluate(jsText) {
    // Wrap the eval in an async function to handle asynchronous code
    const asyncEval = async (code) => {
        return await eval(`(async () => {
            ${code}
        })()`);
    };

    try {
        // Execute the code and get the result
        return await asyncEval(jsText);
    } catch (error) {
        console.error('Error evaluating jsScript:\n' + jsText, error);
        return false;
    }
}

module.exports = {evaluate}



// delete this codes
// no need for sync. async is compatible for code in sync
// if (isSync) {
//     try {
//         // Execute the code and get the result
//         return eval(`(() => {
//                 ${jsText}
//             })()`);
//     } catch (error) {
//         console.error('Error evaluating sync jsScript:\n' + jsText, error);
//         return false;
//     }
// }