require('dotenv').config();

const request = require('request');
const fs = require('fs');



var urlEnd = '';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getSubs = (accessToken, callback) =>{

    const subOptions = {
        url: process.env.GET_SUBS + '&after=' + urlEnd,
        method: 'GET',
        headers:{
            'Authorization': 'Bearer ' + accessToken,
            'Client-ID':process.env.CLIENT_ID
        }
    };

    request.get(subOptions, (err, res, body) => {
        if(err){
            return console.log(err);
        }
        callback(res);
    });

};

async function run(){

    while(true){

        getSubs(process.env.GET_SCOPE_TOKEN, (res) => {

            subCount = JSON.parse(res.body).total;
            fs.writeFile('subgoal.txt', 'Sub Goal! ' + subCount + '/' + (subCount + 1), function (err){
                if(err){
                    return console.log(err);
                }
                console.log('Updated, Sub Count = ' + subCount);
            });
            
        })

        await sleep(1000);

    }

}


run();
