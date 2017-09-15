let fs = require('fs');

let pathDirectory = process.argv[2];

if (pathDirectory !== undefined){
    fs.stat(pathDirectory, (err, stats) => {
        if (err || !(stats.isDirectory())) {
            console.error("Wrong path");
        }
        else{
            fs.writeFile(pathDirectory + '\\summary.js',
"let fs = require('fs');                                                                        \n\
let path = require('path');                                                                     \n\
let pathDirectory = '" + pathDirectory.replace(/\\/g, '/') + "/';                               \n\n\
function createDir(base){                                                                       \n\
    let lastDir = base.split('/');                                                              \n\
    let len = lastDir.length;                                                                   \n\
    let newDir = base + (lastDir[len - 1] === '' ? lastDir[len - 2] : lastDir[len - 1]);        \n\
    fs.mkdir(newDir, (error) => {                                                               \n\
        if (error) {                                                                            \n\
            console.error(error.toString());                                                    \n\
        }                                                                                       \n\
    });                                                                                         \n\
    return newDir;                                                                              \n\
}                                                                                               \n\
function readDir(base, dirForTxt){                                                              \n\
    fs.readdir(base, (err, files) => {                                                          \n\
        files.forEach((item) => {                                                               \n\
            fs.stat(base + '/' + item, (err, state) => {                                        \n\
                if(state.isDirectory()){                                                        \n\
                    let pth = base.slice(-1) === '/' ? base + item : base + '/' + item;         \n\
                    readDir(pth, dirForTxt);                                                    \n\
                } else if(path.extname(item).toLowerCase() === '.txt' && base !== dirForTxt){   \n\
                    moveTxtFile(dirForTxt, base + '/' + item);                                  \n\
                } else {                                                                        \n\
                    console.log(path.relative(pathDirectory, base + '/' + item));               \n\
                }                                                                               \n\
            });                                                                                 \n\
        });                                                                                     \n\
    });                                                                                         \n\
}                                                                                               \n\n\
function moveTxtFile(to, txtFile){                                                              \n\
    fs.readFile('config.json', (err, data) => {                                                 \n\
        if (err) {                                                                              \n\
            console.error('Copyright reading error');                                           \n\
        } else {                                                                                \n\
            let copyright = JSON.parse(data.toString());                                        \n\
            fs.readFile(txtFile, (err, data) => {                                               \n\
                if (err) {                                                                      \n\
                    console.error(err.toString());                                              \n\
                } else {                                                                        \n\
                    let newData = copyright.CR + data.toString() + copyright.CR;                \n\
                    let fName = txtFile.split('/');                                             \n\
                    fs.writeFile(to + '/' + fName[fName.length - 1], newData, 'utf8', () => {});\n\
                }                                                                               \n\
            });                                                                                 \n\
        }                                                                                       \n\
    });                                                                                         \n\
}                                                                                               \n\
let dirForTxt = createDir(pathDirectory);                                                       \n\
readDir(pathDirectory, dirForTxt);                                                              \n\n\
fs.watch(dirForTxt, {encoding: 'buffer'}, (eventType, filename) => {                            \n\
    if (filename) { console.log(filename.toString()); }                                         \n\
});",
                (error) => {
                if (error)
                    console.error("File create error");
            });
        }
        console.log("Done");
    });
} else {
    console.error("Input file path");
}

