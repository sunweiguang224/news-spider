import axios from 'axios';
import db from './db.js';
import util from './util.js';

const CategoryList = [
    {
        category: '推荐',
        category_id: '101',
        category_name: '',
        action: '0',
    },
    {
        category: '娱乐',
        category_id: '',
        category_name: '娱乐',
        action: '1',
    },
    {
        category: '生活',
        category_id: '',
        category_name: '生活',
        action: '1',
    },
    {
        category: '体育',
        category_id: '',
        category_name: '体育',
        action: '1',
    },
    {
        category: '军事',
        category_id: '',
        category_name: '军事',
        action: '1',
    },
    {
        category: '科技',
        category_id: '',
        category_name: '科技',
        action: '1',
    },
    {
        category: '互联网',
        category_id: '',
        category_name: '互联网',
        action: '1',
    },
    {
        category: '国际',
        category_id: '',
        category_name: '国际',
        action: '1',
    },
    {
        category: '国内',
        category_id: '',
        category_name: '国内',
        action: '1',
    },
    {
        category: '人文',
        category_id: '',
        category_name: '人文',
        action: '1',
    },
    {
        category: '汽车',
        category_id: '',
        category_name: '汽车',
        action: '1',
    },
    {
        category: '财经',
        category_id: '',
        category_name: '财经',
        action: '1',
    },
    {
        category: '房产',
        category_id: '',
        category_name: '房产',
        action: '1',
    },
    {
        category: '时尚',
        category_id: '',
        category_name: '时尚',
        action: '1',
    },
];

/**
 * 获取新闻详情
 * @param nid
 * @return {Promise<T>}
 */
async function getBaiduDetail(nid) {
    let response = await axios.request({
        url: `https://news.baidu.com/news?tn=bdapibaiyue&t=recommendinfo`,
        method: `post`,
        data: util.serialize({
            cuid: '',
            nids: nid,
            wf: '1',
            remote_device_type: '1',
            os_type: '2',
            screen_size_width: '375',
            screen_size_height: '667',
        }),
    });
    return response;
}

/**
 * 获取新闻列表（每次20条）
 */
async function getBaiduList(category) {
    // 结果
    let newsList = [];

    // 获取列表
    let response = await axios.request({
        url: `https://news.baidu.com/sn/api/feed_feedlist`,
        method: `post`,
        data: util.serialize({
            from: 'news_webapp',
            pd: 'webapp',
            os: 'iphone',
            mid: '1DD52BBBAC9BE05E7BFC674DF1208F69%3AFG%3D1',
            ver: '6',
            category_id: category.category_id,
            category_name: category.category_name,
            action: category.action,
            display_time: '1535357613275',
            wf: '0',
        }),
    });

    // 获取详情
    for (let item of response.data.data.news) {

        // 获取新闻详情
        let detail = await getBaiduDetail(item.nid);

        // 持久化数据结构
        let news = {
            from: `百度`,
            category: category.category,
            title: item.title,
            desc: item.abs,
            imgs: item.imageurls.map((item) => item.url),
            author: item.site,
            time: item.ts,
            link: item.url,
            contents: [],
            originalData: item,
        };

        // 转换成自定义内容格式：
        // {type: 'text', text: ''}
        // {type: 'image', url: ''}
        let contentList = detail.data.data.news[0].content;
        for (let item of contentList) {

            // 文字段落
            if (item.type === 'text') {
                news.contents.push({
                    type: 'text',
                    // 去标签结构，只留文字
                    text: item.data.replace(/<[^>]*>/g, ''),
                });

                // 图片段落
            } else if (item.type === 'image') {
                news.contents.push({
                    type: 'image',
                    url: item.data.small.url,
                });
            }

        }

        // 存入数组
        newsList.push(news);

        // console.log(`抓取成功${item.nid}`);
    }


    /*for (let news of response.data.data.news) {
     console.log(news.title);
     }*/

    return newsList;
}

/**
 * 插入新闻
 * @param news
 * @return {Promise.<void>}
 */
async function insert(news) {
    news = Object.assign({}, news);

    // 对象属性转JSON
    for (let i in news) {
        if (typeof news[i] === 'object') {
            news[i] = JSON.stringify(news[i]);
        }
    }

    return new Promise((resolve, reject) => {
        db.connect(function (connection) {
            connection.query('insert into news set ?', news, function (err) {
                if (!err) {
                    resolve();
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
    // 每个category请求的次数，每次约20条
    const times = 5;

    try {
        let totalNum = 0, cateNum = 0;
        for (let category of CategoryList) {
            cateNum = 0;
            for (let i = 0; i < times; i++) {
                let newsList = await getBaiduList(category);
                for (let news of newsList) {
                    try {
                        await insert(news);
                        cateNum += 1;
                        totalNum += 1;
                        console.log(`insert成功 [${news.category}${cateNum}] ${totalNum}`);
                    } catch (err) {
                        console.log(`添加失败 [${news.category}] ${err.toString()}`);
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

main().then();