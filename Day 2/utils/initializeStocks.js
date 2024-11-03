require('dotenv').config(); // Tambahkan file .env untuk menyimpan secret key dan value
const mongoose = require('mongoose'); // Library database (MongoDB)
const Stock = require('../models/stock');

const initialStocks = [
    // Kalian bisa menambahkan saham perusahaan disini
    // Sektor teknologi
    { 
        symbol: 'AAPL', 
        name: 'Apel Inc.', 
        currentPrice: 557.27, 
        previousClose: 557.27,
        sector: 'Technology',
        volatility: 0.8
    },
    { 
        symbol: 'META', 
        name: 'Metamorphosis Platforms Inc.', 
        currentPrice: 1063.42, 
        previousClose: 1063.42,
        sector: 'Technology',
        volatility: 0.9
    },
    { 
        symbol: 'AMZN', 
        name: 'Amazing.com Inc.', 
        currentPrice: 494.82, 
        previousClose: 494.82,
        sector: 'Technology',
        volatility: 0.85
    },
    { 
        symbol: 'GGK', 
        name: 'Alfabet Inc. Class K', 
        currentPrice: 287.75, 
        previousClose: 287.75,
        sector: 'Technology',
        volatility: 0.75
    },
    {
        symbol: 'INDA',
        name: 'INIDIA Corp.',
        currentPrice: 338420,
        previousClose: 338420,
        sector: 'Technology',
        volatility: 0.7
    },
    {
        symbol: 'PEAK',
        name: 'Peak Technologies Inc.',
        currentPrice: 78600,
        previousClose: 78600,
        sector: 'Technology',
        volatility: 0.25
    },
    {
        symbol: 'SBTC',
        name: 'So Bakso Corp.',
        currentPrice: 43500,
        previousClose: 43500,
        sector: 'Technology',
        volatility: 0.5
    },
    
    // Sektor Transportasi
    { 
        symbol: 'BAL', 
        name: 'Bonek Airlines Holdings Inc.', 
        currentPrice: 134.10, 
        previousClose: 134.10,
        sector: 'Transportation',
        volatility: 0.75
    },
    {
        symbol: 'HMP',
        name: 'Homipet Aerospace Inc.',
        currentPrice: 214350,
        previousClose: 214350,
        sector: 'Transportation',
        volatility: 0.85
    },
    {
        symbol: 'STBY',
        name: 'Softboy Corp.',
        currentPrice: 683950,
        previousClose: 683950,
        sector: 'Technology',
        volatility: 0.9
    },
    
    // Sektor Keuangan
    { 
        symbol: 'BIT', 
        name: 'BIT Karbit Inc.', 
        currentPrice: 162.60, 
        previousClose: 162.60,
        sector: 'Finance',
        volatility: 0.7
    },
    { 
        symbol: 'BTK', 
        name: 'BATAK Inc.', 
        currentPrice: 622.45, 
        previousClose: 622.45,
        sector: 'Finance',
        volatility: 0.65
    },

    // Sektor Barang Konsumen
    { 
        symbol: 'EST', 
        name: 'Esteh Companies Inc.', 
        currentPrice: 116.45, 
        previousClose: 116.45,
        sector: 'Consumer Goods',
        volatility: 0.5
    },
    { 
        symbol: 'ASLI', 
        name: 'Haji Slamet Corp.', 
        currentPrice: 298.77, 
        previousClose: 298.77,
        sector: 'Consumer Goods',
        volatility: 0.45
    },
    {
        symbol: 'RLTR',
        name: 'Rupiah Tree Inc.',
        currentPrice: 111000,
        previousClose: 111000,
        sector: 'Consumer Goods',
        volatility: 0.6
    },

    // Sektor Sumber Daya
    { 
        symbol: 'FF', 
        name: 'FUFUFAFA Resources Corp.', 
        currentPrice: 275.45, 
        previousClose: 275.45,
        sector: 'Resources',
        volatility: 0.8
    },
    {
        symbol: 'GUN',
        name: 'Gus Nimvunemgoro Inc.',
        currentPrice: 752720,
        previousClose: 752720,
        sector: 'Resources',
        volatility: 0.35
    },
    {
        symbol: 'LIME',
        name: 'Jeruka Nipis Inc.',
        currentPrice: 91050,
        previousClose: 91050,
        sector: 'Resources',
        volatility: 0.85
    },

    // Sektor Lainnya
    {
        symbol: 'IRM',
        name: 'IronMan Inc.',
        currentPrice: 227170,
        previousClose: 227170,
        sector: 'Document Protection Service',
        volatility: 0.8
    },
    {
        symbol: 'WBA',
        name: 'Walawe Boots Alliance Inc.',
        currentPrice: 23650,
        previousClose: 23650,
        sector: 'Healthcare',
        volatility: 0.9
    },
];

async function initializeStocks() {
    try {
        // Database menggunakan MongoDB
        // Mohon untuk menjalankan skrip ini terlebih dahulu jika ingin menambahkan saham perusahaan ke database

        // Validasi apabila tidak ada connection string yang terhubung ke MongoDB
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        // Connect ke MongoDB
        await mongoose.connect(process.env.MONGODB_URI); // Kalian bisa memasukkan connection string database kalian kesini, atau bisa juga dengan mengakses file .env
        console.log('Connected to MongoDB...');

        // Memeriksa apabila semua daftar saham sudah ada sebelumnya
        const existingStocks = await Stock.find({});
        if (existingStocks.length > 0) {
            console.log('Stocks already initialized. Skipping...');
            return;
        }

        // Inisialisasi riwayat harga untuk setiap saham
        const stocksWithHistory = initialStocks.map(stock => ({
            ...stock,
            priceHistory: [{
                price: stock.currentPrice,
                date: new Date()
            }],
            lastUpdate: new Date()
        }));

        // Menambahkan saham perusahaan baru
        await Stock.insertMany(stocksWithHistory);
        console.log('Stocks initialized successfully!');

        // Log ringkasan mengenai daftar saham perusahaan
        console.log(`Initialized ${initialStocks.length} stocks across different sectors:`);
        const sectorSummary = initialStocks.reduce((acc, stock) => {
            acc[stock.sector] = (acc[stock.sector] || 0) + 1;
            return acc;
        }, {});
        console.table(sectorSummary);

    } catch (error) {
        console.error('Error initializing stocks:', error);
        throw error;
    } finally {
        if (mongoose.connection.readyState === 1) { // Hanya akan terputus dari database apabila sudah tergabung dan mengaudit dan/atau merubah data
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB.');
        }
    }
}

// Menambahkan function validasi data saham
function validateStockData(stock) {
    return {
        isValid: 
            typeof stock.symbol === 'string' &&
            typeof stock.name === 'string' &&
            typeof stock.currentPrice === 'number' &&
            typeof stock.previousClose === 'number' &&
            typeof stock.sector === 'string' &&
            typeof stock.volatility === 'number' &&
            stock.volatility >= 0 && 
            stock.volatility <= 1,
        errors: []
    };
}

// Error handling aja sih ini
if (require.main === module) {
    initializeStocks()
        .then(() => {
            console.log('Stock initialization completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('Failed to initialize stocks:', error.message);
            process.exit(1);
        });
}

module.exports = initializeStocks;