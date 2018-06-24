const request = require('axios');
const {extractListingsFromHTML} = require('./helpers');
const fs = require('fs');
const AWS = require('aws-sdk');



module.exports.rates = (event, context, callback) => {

  function csv(table) {
    fs.writeFile("./table.csv", table.csv, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
  }

  function putObjectToS3(bucket, key, data){
    let s3 = new AWS.S3();
        let params = {
            Bucket : bucket,
            Key : key,
            Body : data
        }
    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
}

  request('http://www.global-rates.com/interest-rates/libor/libor.aspx')
    .then(({data}) => {

      const table = extractListingsFromHTML(data);
      csv(table);
      putObjectToS3('global-rates','table.csv',table.csv)
      callback(null, table);
    })
    .catch(callback);
};





