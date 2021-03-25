require('dotenv').config() // always at top
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");

const app = express();


app.use(bodyParser.urlencoded({         // In order to get access to the post data we have to use body-parser. 
    extended: true
}))
app.use(express.static("public"));      // make public dir to acsses css,img files


app.get("/", function (req, res) {                  // send signup page whene user make request from "/" route.
    res.sendFile(__dirname + "/views/signup.html");
});

app.post("/", (req, res, next) => {                       //  when user press sign up button

    console.log(req.body);                          // req.body => user send data when he/she make post request on "/" route.
    const firstName = req.body.fName;
    const lastName = req.body.lName;                    // fatching data from request's body which we gate from user inside body.
    const email = req.body.email;

    const data = {                                  // make list of data which we send to the api server to subscribe user
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {                          // this all are parameters to store diffrant types of data.
                FNAME: firstName,
                LNAME: lastName
            }
        }
        ]
    };
    const jsonData = JSON.stringify(data);          // convert user data in json formate to send data to api server


    const url = process.env.URL    // url where we send user data
    const Option = {                                                     // define method and auth to contect with api serve and make request
        method: "POST",
        auth: process.env.AUTH             // api-keynpm
    };

    const request = https.request(url, Option, (response) => {    // making post request in variable to make post request to api server 
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/views/success.html")              // res.send is use to send response back to brouser
        } else {
            res.sendFile(__dirname + "/views/failure.html")
        }

        response.on("data", data => {
            console.log(JSON.parse(data));           // getting response from api server on post request as response callback function    // here we printing that data
        });
    });
    request.write(jsonData);                       // send data/write data on api server
    request.end();                                 // ending request function
})

app.post("/failure", (req, res) => {
    res.redirect("/");
});

let port = 3000;
app.listen(port, function () {
    console.log('server started');
});
