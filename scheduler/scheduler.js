const fetchAllData = require('../services/fetchAllData');
const cron = require('node-cron');

function startCronJob() {
    // Chạy lúc 06:45 sáng mỗi ngày
    cron.schedule('45 23 * * *', () => {
        console.log('⏰ [CRON] 06:45 sáng – đang chạy fetchAllData...');
        fetchAllData();
    });
}

module.exports = startCronJob;
