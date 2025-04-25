

const { API_KEY } = require('../config');

function getTimestampAtVietnamHour(hour = 7) {
    const now = new Date();

    // Trừ đi 1 ngày để lấy ngày hôm trước theo giờ Việt Nam
    now.setDate(now.getDate());

    const year = now.getFullYear();
    const month = now.getMonth(); // Lưu ý: tháng bắt đầu từ 0
    const date = now.getDate();

    // Tạo Date tại mốc giờ UTC tương ứng với giờ VN
    const dateUTC = new Date(Date.UTC(year, month, date, hour - 7, 0, 0));

    return Math.floor(dateUTC.getTime() / 1000);
}




const fetchLiquidation = async (symbol) => {

    // const now = new Date(); // Lấy thời gian hiện tại
    // const nowTimestamp = Math.floor(now.getTime() / 1000); // Unix timestamp hiện tại
    // const from = Math.floor(nowTimestamp / 3600) * 3600; // Làm tròn về đầu giờ
    // const to = from; // Thời gian hiện tại

    const from = getTimestampAtVietnamHour(7); // timestamp của 07:00 sáng hôm nay theo giờ VN
    const to = from; // Thời gian hiện tại

    // console.log("📦 from:liqui", from, "| to:", to);

    const url = `https://api.coinalyze.net/v1/liquidation-history?symbols=${symbol}_PERP.A&interval=daily&from=${from}&to=${to}&api_key=${API_KEY}&convert_to_usd=true`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        const history = data?.[0]?.history?.[0];
        return {
            long: history?.l ?? 0,
            short: history?.s ?? 0
        };
    } catch (err) {
        console.error(`❌ Lỗi fetchLiquidation: ${err.message}`);
        return { long: 0, short: 0 };
    }
};

module.exports = fetchLiquidation;
//
// const axios = require('axios');
// const { from, to, API_KEY } = require('../config');
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//
// const fetchLiquidation = async (symbol, retries = 3) => {
//     const url = "https://api.coinalyze.net/v1/liquidation-history";
//
//     for (let attempt = 0; attempt < retries; attempt++) {
//         try {
//             const response = await axios.get(url, {
//                 params: {
//                     symbols: `${symbol}_PERP.A`,
//                     interval: "1hour",
//                     from,
//                     to,
//                     api_key: API_KEY
//                 }
//             });
//
//             const item = response.data?.[0];
//             const latest = item?.history?.at(-1);
//
//             if (!latest) {
//                 console.warn(`⚠️ Không có dữ liệu liquidation cho ${symbol}`);
//                 return { long: 0, short: 0 };
//             }
//
//             const { l: long, s: short } = latest;
//             return { long, short };
//
//         } catch (err) {
//             if (err.response?.status === 429) {
//                 console.warn(`❌ Lỗi fetchLiquidation (${symbol}) [429]: Đợi 30s rồi thử lại (${attempt + 1}/${retries})...`);
//                 await sleep(30000); // Đợi 30 giây nếu bị giới hạn
//             } else {
//                 console.error(`❌ Lỗi fetchLiquidation (${symbol}): ${err.message}`);
//                 await sleep(500); // Delay nhẹ khi gặp lỗi khác
//             }
//         }
//     }
//
//     console.error(`❌ fetchLiquidation (${symbol}) thất bại sau ${retries} lần thử.`);
//     return { long: 0, short: 0 };
// };
//
// module.exports = fetchLiquidation;
