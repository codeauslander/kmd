const request = require('axios');
const {extractListingsFromHTML} = require('./helpers');
const moment = require('moment');
const fs = require('fs');
const AWS = require('aws-sdk');

module.exports.rates = (event, context, callback) => {

  const date = moment().format('MM-DD-YYYY');
  const file_ext = ".csv";
  const folder = 'rates/'
  const file_name = folder+date+file_ext;

  function csv(table) {
    fs.writeFile(file_name, table.csv, function(err) {
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
      putObjectToS3('global-rates',file_name,table.csv)
      callback(null, table);
    })
    .catch(callback);
};





