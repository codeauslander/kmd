const cheerio = require('cheerio');
const moment = require('moment');
function extractListingsFromHTML (html) {
  const $ = cheerio.load(html);

  const inside_values = $('table[style="width:100%;margin:10px 0px 0px 0px;border:1px solid #CCCCCC;"] tbody tr td')

  const table = [];
  let count = 0
  let j = 0
  let csv = ""
  inside_values.each((i,el)=>{
    let value = $(el).text().trim().replace(/[^aA-zZ0-9.-]/g, "");
    if (i < 6 ) {
      let column = {}
      let name = "column_" + i;
      column[name] = value;
      table.push(column)
    } else if (count < 7) {
      let row = {}
      let name = "row_"+j;
      row[name] = value;
      table.push(row)
      count += 1

      if (count === 6) {
        count = 0
        j += 1
      }

    }

    if ((i + 1)% 6 == 0) {
      csv += value + "\n"
    } else {
      csv += value + ","
    }
       

  });

  return {csv,table};
}



module.exports = {
  extractListingsFromHTML
};