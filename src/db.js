import mysql from 'mysql';

var db = {
    connect(method) {
        // 创建连接,每次connection.end()之后都要重新创建
        /*var connection = mysql.createConnection({
         // mac本机
         host: 'localhost',
         user: 'root',
         password: 'swg224',
         database: 'mock'
         });*/
        /*var connection = mysql.createConnection({
         // redhat虚拟机
         host: '10.211.55.4',
         user: 'root',
         password: 'swg224',
         database: 'mock'
         });*/
        var connection = mysql.createConnection({
            // newssdk服务器
            host: '127.0.0.1',
            user: 'root',
            password: '111111',
            database: 'news'
        });
        // 连接数据库
        connection.connect();

        try {
            // 执行方法
            method && method(connection);
        } catch (error) {
            console.error(error.toString());
            // throw error;
        } finally {
            //关闭连接
            connection.end();
        }
    }
}

export default db;
