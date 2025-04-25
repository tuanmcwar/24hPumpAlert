// createApiUrl.js
const dayjs = require('dayjs');
const { API_KEY } = require('../config');


function getTimestampAtVietnamHour(hour = 7) {
    const now = new Date();

    // Trừ đi 1 ngày để lấy ngày hôm trước theo giờ Việt Nam
    now.setDate(now.getDate() );

    const year = now.getFullYear();
    const month = now.getMonth(); // Lưu ý: tháng bắt đầu từ 0
    const date = now.getDate();

    // Tạo Date tại mốc giờ UTC tương ứng với giờ VN
    const dateUTC = new Date(Date.UTC(year, month, date, hour - 7, 0, 0));

    return Math.floor(dateUTC.getTime() / 1000);
}



function createApiUrl(symbols) {
    // const now = new Date(); // Lấy thời gian hiện tại
    // const nowTimestamp = Math.floor(now.getTime() / 1000); // Unix timestamp hiện tại
    // const from = Math.floor(nowTimestamp / 3600) * 3600; // Làm tròn về đầu giờ
    // const to = from; // Thời gian hiện tại

    const from = getTimestampAtVietnamHour(7); // timestamp của 07:00 sáng hôm nay theo giờ VN
    const to = from; // Thời gian hiện tại

    const symbolParam = symbols.join(',');
    console.log("url",from);
    return `https://api.coinalyze.net/v1/ohlcv-history?symbols=${symbolParam}&interval=daily&from=${from}&to=${to}&api_key=${API_KEY}`;
}

module.exports = {
    createApiUrl,

};