import axios from 'axios';

async function getBaiduList() {
    return await axios.request({
        url: `https://news.baidu.com/sn/api/feed_feedlist`,
        method: `post`,
        responseType: `json`,
        data: `from=news_webapp&pd=webapp&os=iphone&mid=1DD52BBBAC9BE05E7BFC674DF1208F69%3AFG%3D1&ver=6&category_id=101&action=0&display_time=1535357613275&wf=0`,
        headers: {},
    });
}

async function getBaiduDetail(nid) {
    let url = `https://news.baidu.com/news?tn=bdapibaiyue&t=recommendinfo`;
    // console.log(url)
    return await axios.request({
        url,
        method: `post`,
        responseType: `json`,
        data: `cuid=&nids=${nid}&wf=1&remote_device_type=1&os_type=2&screen_size_width=375&screen_size_height=667`,
        headers: {},
    });
}

getBaiduList().then(async (response) => {
    let newsList = [];

    for (let item of response.data.data.news) {
        // 转换新闻总体数据结构
        let news = {
            from: `百度`,
            category: `推荐`,
            title: item.title,
            desc: item.abs,
            imgs: item.imageurls.map((item) => item.url),
            author: item.site,
            ts: item.ts,
            link: item.url,
            contents: [],
            originalData: item,
        };

        try {
            // 获取新闻详情
            let detail = await getBaiduDetail(item.nid);
            let detailContent = detail.data.data.news[0].content;

            // 转换新闻详情数据结构
            for (let item of detailContent) {
                if (item.type === 'text') {
                    news.contents.push({
                        type: 'text',
                        // 去标签结构，只留文字
                        text: item.data.replace(/<[^>]*>/g, ''),
                    });
                } else if (item.type === 'image') {
                    news.contents.push({
                        type: 'image',
                        url: item.data.small.url,
                    });
                }
            }

            newsList.push(news);

            console.log(`抓取成功${item.nid}`);
        } catch (err) {
            console.log(`抓取失败${item.nid}`)
        }
    }

    console.log(newsList);
});