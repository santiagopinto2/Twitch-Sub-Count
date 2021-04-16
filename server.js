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

        var end = false;
        var lastAddition = 0;
        var subCount = 0;
        urlEnd = '';

        while(!end){

            await sleep(500);
            getSubs(process.env.GET_SCOPE_TOKEN, (res) => {

                lastAddition = JSON.parse(res.body).data.length;
                subCount += JSON.parse(res.body).data.length;
                console.log('Old: ' + end);
                console.log('New: ' + subCount);
                if(JSON.parse(res.body).pagination.cursor == null){
                    console.log('END');
                    end = true;
                    return subCount;
                }
                console.log(JSON.parse(res.body));
                urlEnd = JSON.parse(res.body).pagination.cursor;
                console.log('Test Sub Count = ' + subCount);
                return subCount;

            })
            
        }

        subCount -= lastAddition;
        subCount -= 1;
        fs.writeFile('subgoal.txt', 'Sub Goal! ' + subCount + '/' + (subCount + 1), function (err){
            if(err){
                return console.log(err);
            }
            console.log('Updated, Sub Count = ' + subCount);
        });

        await sleep(20000);

    }

}


run();
