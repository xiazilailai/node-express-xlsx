// created at 2019/03/14

const path = require("path");
const xlsx = require("xlsx-style");
const express = require("express");
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

const app = express();

app.use(express.static("app"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



const transformDate = (localeDateString) => {
    let date = localeDateString.split(/\/|-/);
    date[1] = date[1] < 10 ? "0" + date[1] : date[1];
    date[2] = date[2] < 10 ? "0" + date[2] : date[2];
    return date.join("-");
};

function readTempAndWrite(rows){
    const wb = xlsx.readFile(path.resolve(__dirname, "./excel/dailyTemplate.xlsx"), {
        cellStyles: true,
        bookFiles: true
    });
    // console.log(wb.SheetNames);
    const ws = wb.Sheets[wb.SheetNames[0]];
    // console.log(JSON.stringify(ws['!freeze']));
    // ws["!freeze"] = {
    //     xSplit: "1",
    //     ySplit: "2",
    //     topLeftCell: "B3",
    //     activePane: "bottomRight",
    //     state: "frozen"
    // };
    // ws["B3"].v = "10000";
    const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
    rows.forEach((r, i) => {
        r.forEach((c, j) => {
            ws[cols[j + startx] + (i + starty)].v = c;
        });
    });
    
    xlsx.writeFile(wb, path.resolve(__dirname, "./excel/output.xlsx"));

    const wbout = xlsx.write(wb,wopts); // 写为二进制
    return wbout;
}

const cols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const startx = 1;
const starty = 3;

app.post("/Excel", function(req, res){
    console.log("body", req.body.rows);
    const rows = JSON.parse(req.body.rows || "[[]]");
    const wbout = readTempAndWrite(rows);

    const today = transformDate(new Date().toLocaleDateString());
    const user = "宁明远";
    const area = "成都";
    const filename = encodeURI(`【${area}】工作情况 ${today} ${user}`);
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    // res.end(wbout, 'binary');
    // 新式写法, 与上面注释掉的等同
    res.set({
        'Content-Type': 'application/vnd.openxmlformats',
        "Content-Disposition": "attachment; filename=" + filename + ".xlsx"
    }).end(wbout, 'binary');
});

app.listen(8080);
