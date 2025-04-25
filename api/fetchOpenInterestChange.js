const axios = require('axios');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const { API_KEY } = require('../config'); // Đảm bảo bạn có dòng này đúng

function getTimestampAtVietnamHour(hour = 7) {
    const now = new Date();

    // Trừ đi 1 ngày để lấy ngày hôm trước theo giờ Việt Nam
    now.setDate(now.getDate() - 1);

    const year = now.getFullYear();
    const month = now.getMonth(); // Lưu ý: tháng bắt đầu từ 0
    const date = now.getDate();

    // Tạo Date tại mốc giờ UTC tương ứng với giờ VN
    const dateUTC = new Date(Date.UTC(year, month, date, hour - 7, 0, 0));

    return Math.floor(dateUTC.getTime() / 1000);
}




const fetchOpenInterestChange = async (symbol, retries = 3) => {
    // const now = new Date();
    // const nowTimestamp = Math.floor(now.getTime() / 1000);
    // const from = Math.floor(nowTimestamp / 3600) * 3600;
    // const to = from;
    const from = getTimestampAtVietnamHour(7); // timestamp của 07:00 sáng hôm nay theo giờ VN
    const to = from; // Thời gian hiện tại



    const url = "https://api.coinalyze.net/v1/open-interest-history";

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
            const latest = item?.history?.at(-1);
            if (!latest) return null;

            // Trả về các thông số từ API mà không tính toán gì thêm
            return {
                symbol: item.symbol,
                open: latest.o,
                close: latest.c,
                timestamp: latest.t
            };

        } catch (err) {
            if (err.response?.status === 429) {
                console.warn(`❌ Lỗi fetchOpenInterestChange (429): Đợi 30s rồi thử lại (${attempt + 1}/${retries})...`);
                await sleep(30000); // Đợi 30 giây
            } else {
                console.error(`❌ Lỗi fetchOpenInterestChange: ${err.message}`);
                return null;
            }
        }
    }

    console.error(`❌ fetchOpenInterestChange thất bại sau ${retries} lần thử.`);
    return null;
};

module.exports = fetchOpenInterestChange;
