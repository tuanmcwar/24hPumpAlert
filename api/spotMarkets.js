const axios = require("axios");
const { API_KEY } = require('../config'); // Bạn nên lưu API key ở đây cho tiện quản lý

async function getSpotMarkets() {
    try {
        const response = await axios.get('https://api.coinalyze.net/v1/spot-markets', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const allMarkets = response.data;

        if (!allMarkets || !Array.isArray(allMarkets)) {
            console.error("Dữ liệu trả về không phải mảng:");
            return [];
        }


        // Lọc những thị trường có quote_asset là 'USDT' và exchange là 'A'
        const filteredMarkets = allMarkets.filter(
            market => market.quote_asset === 'USDT' && market.exchange === 'A'
        );

        // console.log("Số lượng markets có 'quote_asset' là 'USDT' và 'exchange' là 'A':", filteredMarkets.length);

        return filteredMarkets;
    } catch (error) {
        console.error('Lỗi khi gọi API spot-markets:', error.message);
        if (error.response) console.error('Chi tiết lỗi:', error.response.data);
        return [];
    }
}

module.exports = getSpotMarkets;
