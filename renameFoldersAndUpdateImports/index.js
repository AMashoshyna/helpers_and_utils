const fs = require('fs');

const DASH = '-';

const removeSymbolAndUpperCaseNext = function(str, symbol) {
    let cursor = 0;
    let result = str;

    while (cursor < str.length) {
        const nextDashPosition = str.indexOf(symbol, cursor);
        const nextSymbol = str[nextDashPosition + 1];
        if (nextDashPosition === -1) {
            break;
        } else if (nextSymbol) {
            const nextSymbolCapital = nextSymbol.toUpperCase();
            result = result.replace(
                `${symbol}${nextSymbol}`,
                nextSymbolCapital
            );
            cursor = nextDashPosition + 1;
        } else {
            break;
        }
    }
    return result;
};

const replaceInFile = function(file, oldString, newString) {
    const data = fs.readFileSync(file, 'utf-8');
    const newData = data.replace(
        new RegExp(`${oldString}'`, 'g'),
        `${newString}'`
    );
    fs.writeFileSync(file, newData, 'utf-8');
    console.log(`Done replacing ${oldString} with ${newString}`);
};

const containsDashes = str => str.indexOf(DASH) !== -1;

module.exports = function(sourcePath, indexFilePath) {
    const folders = fs.readdirSync(sourcePath);
    folders.filter(containsDashes).forEach(folderName => {
        const newName = removeSymbolAndUpperCaseNext(folderName, DASH);

        replaceInFile(indexFilePath, folderName, newName);

        fs.rename(`${sourcePath}/${folderName}`, `${sourcePath}/${newName}`);
    });
};
