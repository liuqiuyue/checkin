const request = require("request");

const schedule = require("node-schedule"); // 这里输入你的cookie，可以打开掘金控制台，随便找一个network，在Request headers里找到cookie，复制过来
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "destroyWb.txt");

const HEADERS = process.env.HEADERS;

const getIdArr = (index) => {
    const url =
        "https://weibo.com/ajax/statuses/mymblog?uid=1157268207&page=" +
        index +
        "&feature=0";
    let options = {
        url,
        method: "GET",
        headers: HEADERS,
    };

    //发起请求
    request(options, (err, res, body) => {
        if (err) {} else {
            const _body = JSON.parse(body);
            const arr =
                _body.data &&
                _body.data.list.filter((el) => typeof el.url_struct != "undefined");
            arr.forEach(async (el) => {
                await t(el);
            });
        }
    });
};

function t(el) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            deleteWb(el.id);
            resolve();
        }, 5000);
    });
}

const deleteWb = (id) => {
    const url = "https://weibo.com/ajax/statuses/destroy";
    let options = {
        url,
        method: "POST",
        headers: HEADERS,
        form: {
            id,
        },
    };
    //发起请求
    request(options, (err, res, body) => {
       
        if (err) {
            //console.log(nowTime.toLocaleTimeString() + "---->请求失败---->\n" + err);
        } else {
            //console.log(nowTime.toLocaleTimeString() + "---->请求成功---->\n");
            //console.log(body)
        }
    });
};

function scheduleCancel() {
    var rule1 = new schedule.RecurrenceRule();
    var times1 = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
    rule1.second = times1;

    let counter = 1;
    var j = schedule.scheduleJob(rule1, () => {
        getIdArr(counter);
        counter++;
    });

    if (counter > 30) {
            console.log("---->请求成功---->\n");

        j.cancel();
    }
}

scheduleCancel();