let fs = require('fs');                                                                        
let path = require('path');                                                                     
let pathDirectory = 'D:/Projects/Node/cwp-01/';                               

function createDir(base){                                                                       
    let lastDir = base.split('/');                                                              
    let len = lastDir.length;                                                                   
    let newDir = base + (lastDir[len - 1] === '' ? lastDir[len - 2] : lastDir[len - 1]);        
    fs.mkdir(newDir, (error) => {                                                               
        if (error) {                                                                            
            console.error(error.toString());                                                    
        }                                                                                       
    });                                                                                         
    return newDir;                                                                              
}                                                                                               
function readDir(base, dirForTxt){                                                              
    fs.readdir(base, (err, files) => {                                                          
        files.forEach((item) => {                                                               
            fs.stat(base + '/' + item, (err, state) => {                                        
                if(state.isDirectory()){                                                        
                    let pth = base.slice(-1) === '/' ? base + item : base + '/' + item;         
                    readDir(pth, dirForTxt);                                                    
                } else if(path.extname(item).toLowerCase() === '.txt' && base !== dirForTxt){   
                    moveTxtFile(dirForTxt, base + '/' + item);                                  
                } else {                                                                        
                    console.log(path.relative(pathDirectory, base + '/' + item));               
                }                                                                               
            });                                                                                 
        });                                                                                     
    });                                                                                         
}                                                                                               

function moveTxtFile(to, txtFile){                                                              
    fs.readFile('config.json', (err, data) => {                                                 
        if (err) {                                                                              
            console.error('Copyright reading error');                                           
        } else {                                                                                
            let copyright = JSON.parse(data.toString());                                        
            fs.readFile(txtFile, (err, data) => {                                               
                if (err) {                                                                      
                    console.error(err.toString());                                              
                } else {                                                                        
                    let newData = copyright.CR + data.toString() + copyright.CR;                
                    let fName = txtFile.split('/');                                             
                    fs.writeFile(to + '/' + fName[fName.length - 1], newData, 'utf8', () => {});
                }                                                                               
            });                                                                                 
        }                                                                                       
    });                                                                                         
}                                                                                               
let dirForTxt = createDir(pathDirectory);                                                       
readDir(pathDirectory, dirForTxt);                                                              

fs.watch(pathDirectory, {encoding: 'buffer'}, (eventType, filename) => {
    if (filename) { console.log(filename.toString()); }                                         
});