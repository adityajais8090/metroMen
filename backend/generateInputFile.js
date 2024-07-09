const fs = require('fs');
const path = require('path');
const {v4 : uuid} = require('uuid');

const dirInput = path.join(__dirname , "inputs"); //C:\Users\jarvis\OneDrive\Desktop\cp\algoUniversity_homework\algo_dev_season\class_codes\compiler\backend\generateFile.js

console.log(dirInput);
// check if dir is exist , we don't need to create that
if(!fs.existsSync(dirInput)){
    fs.mkdir(dirInput , {recursive : true }, (error)=>{
        console.log("error in making directory : ", error);
    });
    console.log("Directory form Successfully!")
}


const generateInputFile = ( graphFilePath, input ) =>{
  
    const jobID = uuid(); //f773008d-995c-4bb2-bb6a-506437d01cc1
    const input_filename = path.join(`${jobID}.txt`); //bfc09f72-d5b5-4fcb-92ee-e7fd594c6c24.java
    const input_filePath = path.join( dirInput, input_filename );
    
     // Read contents of graph.txt
     const graphContent = fs.readFileSync(graphFilePath, 'utf-8');

     // Prepend graphContent to the input
    const finalInput = graphContent + "\n" + input;

    fs.writeFileSync(input_filePath, finalInput);
    return input_filePath;    
}

module.exports = { 
    generateInputFile,
}