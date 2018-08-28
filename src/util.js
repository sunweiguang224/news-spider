export default {
    /**
     * 对象 -> 表单字符串
     * @param obj
     * @return {string}
     */
    serialize(obj) {
        let str = '';
        for (let i in obj) {
            str = `${str}&${i}=${encodeURIComponent(obj[i])}`;
        }
        if (str.length) {
            str = str.substr('1');
        }
        // console.log(str);
        return str;
    },
}