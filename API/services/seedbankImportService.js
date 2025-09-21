const fs = require("fs");
const csv = require("csv-parser");
const Seedbank = require("../models/Seedbank");

async function importSeedbanksFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (const row of results) {
            const {
              name,
              url,
              countries,
              paymentMethods,
              rating,
              affiliateId,
              shippingCost,
              shippingCurrency,
              shippingDays,
            } = row;
            await Seedbank.updateOne(
              { name },
              {
                name,
                url,
                countries: countries.split("|"),
                paymentMethods: paymentMethods.split("|"),
                rating: parseFloat(rating),
                affiliateId,
                shipping: {
                  cost: parseFloat(shippingCost),
                  currency: shippingCurrency,
                  estimatedDays: parseInt(shippingDays),
                },
              },
              { upsert: true },
            );
          }
          resolve({ inserted: results.length });
        } catch (err) {
          reject(err);
        }
      });
  });
}

module.exports = { importSeedbanksFromCSV };
