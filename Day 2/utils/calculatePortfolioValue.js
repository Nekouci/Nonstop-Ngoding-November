const Stock = require('../models/stock');

async function calculatePortfolioValue(user) {
    let totalValue = 0;

    for (const item of user.portfolio) {
        const stock = await Stock.findOne({ symbol: item.stockSymbol });
        if (stock) {
            totalValue += item.quantity * stock.currentPrice;
        }
    }

    return totalValue;
}

module.exports = calculatePortfolioValue;