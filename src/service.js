import express from 'express';
import db from './db.js';
import util from './util.js';
import model from './model.js';
import cookieParser from 'cookie-parser';
import http from 'http';

/**
 * 新闻列表分页查询
 * @param news
 * @return {Promise.<void>}
 */
async function queryNewsList({pageSize = 10, pageNo = 1, category = '推荐'}) {
    return new Promise((resolve, reject) => {
        db.connect(function (connection) {
            let sql = `select ${model.map(item => `\`${item}\``)} from news where category='${category}' limit ${(pageNo - 1) * pageSize}, ${(pageNo) * pageSize}`;
            console.log(sql);
            connection.query(sql, (err, results, fields) => {
                if (!err) {
                    for (let item of results) {
                        for (let i in item) {
                            try {
                                item[i] = JSON.parse(item[i]);
                            } catch (err) {
                            }
                        }
                    }
                    resolve(results);
                } else {
                    reject(err);
                }
            });
        });
    });
}

/**
 * 新闻详情查询
 * @param news
 * @return {Promise.<void>}
 */
async function queryNewsDetail({id}) {
    return new Promise((resolve, reject) => {
        db.connect(function (connection) {
            let sql = `select ${model.map(item => `\`${item}\``)} from news where id='${id}'`;
            console.log(sql);
            connection.query(sql, (err, results, fields) => {
                if (!err) {
                    for (let item of results) {
                        for (let i in item) {
                            try {
                                item[i] = JSON.parse(item[i]);
                            } catch (err) {
                            }
                        }
                    }
                    resolve(results && results[0]);
                } else {
                    reject(err);
                }
            });
        });
    });
}

/**
 * 入口
 */
async function main() {
    let a = await queryNewsList({category: '军事', pageNo: 3});
    console.log(a)
}

// main().then();


/************************************ 服务端启动任务 ************************************/
console.log(`>>>>>>>>>>>>>>> 服务端启动任务开始执行。${util.getNow()}`);

// 全局服务
let app = express();

// 全局cookie解析，为req增加cookies字段，可以使用req.cookies.xxx获取单个cookie
app.use(cookieParser());

// 设置全局response header
app.use((req, res, next) => {
    // res.set('Content-Type', 'application/json');
    // res.set('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', '*');

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");

    res.set("Content-Type", "application/json");

    next();
});

// 全局异常处理，服务端发生异常时将错误返回给页面
app.use((err, req, res, next) => {
    console.error(err.stack, {req});
    res.status(500).send('服务器发生异常:\n' + err.stack);
});

// 新闻列表分页接口
app.use(express.Router().get('/api/queryNewsList', async (req, res, next) => {
    let obj = await queryNewsList({
        category: req.query.category,
        pageNo: req.query.pageNo,
        pageSize: req.query.pageSize,
    });
    res.end(JSON.stringify(obj));
}));

// 新闻详情接口
app.use(express.Router().get('/api/queryNewsDetail', async (req, res, next) => {
    let obj = await queryNewsDetail({
        id: req.query.id,
    });
    res.end(JSON.stringify(obj));
}));

// 创建全局http(s)服务
let httpServer = http.createServer(app);

httpServer.listen(8100, () => {
    console.log(`http服务已启动 ${JSON.stringify(httpServer.address())}`);
});