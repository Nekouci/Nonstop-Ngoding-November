const MarketEvent = require('../models/marketEvent');
const Stock = require('../models/stock');

const events = [
    { type: 'Product Launch', impact: 0.1, description: 'New product launched successfully!' },
    { type: 'Earnings Report', impact: -0.05, description: 'Quarterly earnings lower than expected.' },
    { type: 'Market Trend', impact: 0.08, description: 'Uptrend in the market for similar stocks.' },
];

async function generateMarketEvent() {
    const stocks = await Stock.find();
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    const event = events[Math.floor(Math.random() * events.length)];

    const priceChange = randomStock.currentPrice * event.impact;
    randomStock.currentPrice += priceChange;
    await randomStock.save();

    const newEvent = await MarketEvent.create({
        stockSymbol: randomStock.symbol,
        type: event.type,
        impact: event.impact,
        description: event.description,
    });

    return newEvent;
}

module.exports = generateMarketEvent;