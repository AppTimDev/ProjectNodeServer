const { exec } = require("child_process");

function execCmd(command){
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });
}

module.exports = {execCmd};