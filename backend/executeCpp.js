const fs = require('fs');
const path = require('path');
const {v4 : uuid} = require('uuid');
const {exec} = require('child_process');

const outputPath = path.join(__dirname , "outputs"); 


// check if dir is exist , we don't need to create that
if(!fs.existsSync(outputPath)){
    fs.mkdir(outputPath , {recursive : true }, (error)=>{
        console.log("error in making directory : ", error);
    });
    console.log("Directory form Successfully!")
}


const executeCpp = ( filepath, inputPath ) =>{
  
    const jobID = path.basename(inputPath).split(".")[0];
    console.log(jobID);
    const filename = `${jobID}.out`;
    const outpath = path.join(outputPath, filename);
    
    console.log("This is my outpath : " , outpath);
    


    return new Promise ( (resolve,reject) =>{
      const command = `g++ ${filepath} -o ${outpath} && cd ${outputPath} && ./${filename} < ${inputPath}`;
        exec(command,
        (error, stdout, stderr) => {
          if(error){
            console.log("Here is my error:", error);
                reject({ error: error.message, stderr });
            }
          if(stderr){ 
            reject({ error: "Compilation or execution error", stderr });
          }
          resolve(stdout);
        }
      );
    });

}

module.exports = { 
    executeCpp,
}