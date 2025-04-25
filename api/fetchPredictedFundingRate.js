const axios = require('axios');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const { API_KEY } = require('../config'); // Bạn nên lưu API key ở đây cho tiện quản lý


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




const fetchPredictedFundingRate = async (symbol, retries = 3) => {
    // const now = new Date();
    // const nowTimestamp = Math.floor(now.getTime() / 1000);
    // const from = Math.floor(nowTimestamp / 3600) * 3600;
    // const to = from;
    const from = getTimestampAtVietnamHour(7); // timestamp của 07:00 sáng hôm nay theo giờ VN
    const to = from; // Thời gian hiện tại

    const url = "https://api.coinalyze.net/v1/predicted-funding-rate";

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await axios.get(url, {
                params: {
                    symbols: symbol,
                    interval: "daily",
                    from,
                    to,
                    api_key: API_KEY
                }
            });

            const item = response.data.find(entry => entry.symbol === symbol);
            if (!item) return null;

            const { value, update } = item;
            return {
                symbol,
                value,
                update
            };

        } catch (err) {
            if (err.response?.status === 429) {
                console.warn(`❌ Lỗi fetchPredictedFundingRate (429): Đợi 30s rồi thử lại (${attempt + 1}/${retries})...`);
                await sleep(30000);
            } else {
                console.error(`❌ Lỗi fetchPredictedFundingRate: ${err.message}`);
                return null;
            }
        }
    }

    console.error(`❌ fetchPredictedFundingRate thất bại sau ${retries} lần thử.`);
    return null;
};

module.exports = fetchPredictedFundingRate;
