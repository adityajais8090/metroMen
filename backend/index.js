const express = require('express');
const path = require('path');
const app = express();
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const cors  = require('cors');

//middlewares
const filepathminInterchange = path.join(__dirname , "codes" , "minInterchange.cpp");
const graphFilePath = path.join(__dirname, "codes", "graph.txt");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { input } = req.body;
    try {
        const inputPath = generateInputFile(graphFilePath , input);
        console.log("Here is my input : ", input);
        const output = await executeCpp(filepathminInterchange, inputPath);
        res.json({ 
            filepathminInterchange, 
            output, 
            inputPath,
            success : true,
          });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000!");
});