

// const now = new Date(); // Lấy thời gian hiện tại
// const nowTimestamp = Math.floor(now.getTime() / 1000); // Unix timestamp hiện tại
// const from = Math.floor(nowTimestamp / 3600) * 3600; // Làm tròn về đầu giờ
// const to = from; // Thời gian hiện tại



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



const from = getTimestampAtVietnamHour(7); // timestamp của 07:00 sáng hôm nay theo giờ VN
const to = from; // Thời gian hiện tại

module.exports = {
    TELEGRAM_BOT_TOKEN: '8124541723:AAGSih3ZxgPORFGeogvH2tSgAzUVyPGLvlo',
    // TELEGRAM_BOT_TOKEN: '7640879888:AAGc6mAoVGNJKGmETLrZq3q3UTQ6QIWTZrE',//dev
    TELEGRAM_CHAT_ID: '5710130520',
    API_KEY: 'a98d8913-cad1-4eb5-9b5e-ab10f976d441',
    from,
    to
};


