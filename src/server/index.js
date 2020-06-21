const express = require('express');
const exec = require('child_process').exec

const app = express();

app.get('/print', (req, res) => {
  const svg = ''
  // const svg = req.body.svg

  exec(`axicli ${svg}.svg`, (err, stdout, stderr) => {
    //   if (error) {
    //     console.log(`error: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.log(`stderr: ${stderr}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);
  })
})

app.get('/test', (req, res) => {
  // spawn('cd ~/Documents/axidraw && yarn start')

  // res.send('testing getting SVG')

  // exec("yarn start", (error, stdout, stderr) => {
  //   if (error) {
  //     console.log(`error: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.log(`stderr: ${stderr}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // });

  // exec("ls -la", (error, stdout, stderr) => {
  //   if (error) {
  //     console.log(`error: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.log(`stderr: ${stderr}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // });
})


app.listen(8080)