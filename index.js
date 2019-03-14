// created at 2019/03/14

const path = require("path");
const xlsx = require("xlsx-style");
const express = require("express");
const app = express();

const wb = xlsx.readFile(path.resolve(__dirname, "./excel/template.xlsx"), {
    cellStyles: true,
    bookFiles: true
});

console.log(wb.SheetNames);

const ws = wb.Sheets[wb.SheetNames[0]];

console.log(JSON.stringify(ws["B3"]));

ws["B3"].v = "SKDGG";

xlsx.writeFile(wb, path.resolve(__dirname, "./excel/output.xlsx"));
const wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

// const wbout = xlsx.write(wb,wopts); // 写为二进制流

app.get("/Excel", function(req, res){
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    const wbout = xlsx.write(wb,wopts); // 写为二进制
    res.set({
        'Content-Type': 'application/vnd.openxmlformats',
        "Content-Disposition": "attachment; filename=" + "Report.xlsx"
    }).end(wbout, 'binary');
});
// const myLogger = function (req, res, next) {
//     console.log('LOGGED')
//     next();
// }
  
// app.use(myLogger);

app.listen(8080);
