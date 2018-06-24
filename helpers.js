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

    if (i < 6 ) {
      let column = {}
      let name = "column_" + i;
      column[name] = $(el).text().trim();
      table.push(column)
    } else if (count < 7) {
      let row = {}
      let name = "row_"+j;
      row[name] = $(el).text().trim();
      table.push(row)
      count += 1

      if (count === 6) {
        count = 0
        j += 1
      }

    }

    if ((i + 1)% 6 == 0) {
      csv += $(el).text().trim() + "\n"
    } else {
      csv += $(el).text().trim() + ","
    }
       

  });

  return {csv,table};
}



module.exports = {
  extractListingsFromHTML
};