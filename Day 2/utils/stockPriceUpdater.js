const Stock = require('../models/stock');
const mongoose = require('mongoose'); // Library database (MongoDB)

async function updateStockPrices() {
    try {
        // Memeriksa apabila database telah terhubung
        if (mongoose.connection.readyState !== 1) {
            console.log('Database not connected. Skipping stock update.');
            return;
        }

        const stocks = await Stock.find();
        
        for (const stock of stocks) {
            // Menyimpan harga saham sebelumnya sebagai riwayat
            stock.previousClose = stock.currentPrice;
            
            // Mengkalkulasi harga baru
            const marketSentiment = (Math.random() * 2 - 1) * 0.3;
            const priceChange = calculatePriceChange(stock, marketSentiment);
            const newPrice = stock.currentPrice * (1 + priceChange);
            
            // Memperbarui data saham
            stock.currentPrice = Math.max(1, parseFloat(newPrice.toFixed(2)));
            stock.priceHistory.push({
                price: stock.currentPrice,
                date: new Date()
            });
            
            // Keep only last 10 entries Data riwayat saham perusahaan hanya akan disimpan sebanyak 10 entri
            // (Bisa diubah)
            if (stock.priceHistory.length > 10) {
                stock.priceHistory = stock.priceHistory.slice(-10);
            }
            
            stock.lastUpdate = new Date();
            
            // Menyimpan data
            await stock.save().catch(async (error) => {
                console.error(`Failed to save ${stock.symbol}, retrying...`, error);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return stock.save();
            });
        }
    } catch (error) {
        console.log(`Error in updateStockPrices:`);
        console.error(error);
    }
}

// Mengkalkulasi perubahan harga pasar berdasarkan volatilitas, perusahaan, jam pasar, dll.
// Biar simulasinya makin real hehe
function calculatePriceChange(stock, marketSentiment) {
    // Volatilitas dasar (Masing-masing saham perusahaan memiliki tingkat volatilitas yang berbeda-beda)
    const baseVolatility = getStockVolatility(stock.symbol);
    
    // Faktor perusahaan dan jam pasar
    const companyFactor = (Math.random() * 2 - 1) * 0.02;
    const timeFactor = getTimeFactor();

    // Simulasi momentum yang berbasis volume
    const momentum = (Math.random() * 2 - 1) * 0.01;
    
    // Menggabungkan semua faktor
    const totalChange = (
        (marketSentiment * 0.4) + // 40% market influence
        (companyFactor * 0.3) +   // 30% company-specific influence
        (timeFactor * 0.2) +      // 20% time-based influence
        (momentum * 0.1)          // 10% momentum influence
    ) * baseVolatility;
    
    // Batas maksimum perubahan harga saham perusahaan
    return Math.max(Math.min(totalChange, 0.1), -0.1); // Maksimum 10% persentase perubahan setiap update
}

function getStockVolatility(symbol) {
    // Memasukkan nilai volatilitas dasar untuk berbagai kategori saham
    const volatilityMap = {
        'META': 0.9,  // Volatilitas tinggi
        'STBY': 0.9,
        'WBA': 0.9,
        'AMZN': 0.85,
        'HMP': 0.85,
        'LIME': 0.85,
        'AAPL': 0.8,
        'FF': 0.8,
        'IRM': 0.8,
        'GGK': 0.75,
        'BAL': 0.75,
        'INDA': 0.7,  // Volatilitas sedang
        'BIT': 0.7,
        'PEAK': 0.7,
        'BTK': 0.65,
        'RLTR': 0.6,
        'WBA': 0.5,   // Volatilitas rendah
        'EST': 0.5,
        'SBTC': 0.5,
        'ASLI': 0.45,
        'GUN': 0.35,
        'PEAK': 0.25,
        'default': 0.7 // Volatilitas default (Apabila terdapat saham perusahaan dengan nilai volatilitas yang belum diketahui)
    };
    
    return volatilityMap[symbol] || volatilityMap.default;
}

function getTimeFactor() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Pasar buka
    if (hour === 9 && minute <= 30) {
        return (Math.random() * 2 - 1) * 0.03;
    }
    
    // Pasar tutup
    if (hour === 15 && minute >= 30) {
        return (Math.random() * 2 - 1) * 0.025;
    }
    
    // Waktu makan siang
    if (hour === 12) {
        return (Math.random() * 2 - 1) * 0.01;
    }
    
    // Jam reguler
    return (Math.random() * 2 - 1) * 0.015;
}

module.exports = updateStockPrices;