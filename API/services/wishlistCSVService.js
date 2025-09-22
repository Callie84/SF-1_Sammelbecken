const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Parser } = require("json2csv");
const Wishlist = require("../models/Wishlist");

const DEFAULT_WISHLIST_NAME = "Imported Wishlist";

function parseWishlistCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

function normalizeCsvRow(row) {
  if (!row) return null;
  const strain = typeof row.strain === "string" ? row.strain.trim() : "";
  const note = typeof row.note === "string" ? row.note.trim() : "";
  if (!strain) return null;
  return note ? { strain, note } : { strain, note: "" };
}

async function resolveWishlist(userId, options = {}) {
  const {
    wishlistId,
    wishlistName,
    createIfMissing = false,
    fallbackToAny = false,
    lean = false,
  } = options;

  const targetName = wishlistName || DEFAULT_WISHLIST_NAME;
  let wishlist = null;

  if (wishlistId) {
    const query = Wishlist.findOne({ _id: wishlistId, userId });
    wishlist = lean ? await query.lean() : await query;
  }

  if (!wishlist && targetName) {
    const query = Wishlist.findOne({ userId, name: targetName });
    wishlist = lean ? await query.lean() : await query;
  }

  if (!wishlist && fallbackToAny) {
    const query = Wishlist.findOne({ userId }).sort({ createdAt: 1 });
    wishlist = lean ? await query.lean() : await query;
  }

  if (!wishlist && createIfMissing) {
    if (lean) {
      throw new Error("Cannot create wishlist when lean option is enabled");
    }
    wishlist = new Wishlist({ userId, name: targetName, items: [] });
  }

  return wishlist;
}

// CSV-Import: Liest data/wishlist_import.csv
async function importWishlistFromCSV(userId, options = {}) {
  const filePath = path.resolve(__dirname, "../data/wishlist_import.csv");
  const csvRows = await parseWishlistCSV(filePath);
  const itemsToInsert = csvRows
    .map((row) => normalizeCsvRow(row))
    .filter((row) => row);

  if (itemsToInsert.length === 0) {
    return "No valid wishlist items found in CSV";
  }

  const wishlist = await resolveWishlist(userId, {
    ...options,
    createIfMissing: true,
  });

  itemsToInsert.forEach((item) => {
    wishlist.items.push(item);
  });
  await wishlist.save();

  return `Imported ${itemsToInsert.length} wishlist items into "${wishlist.name}"`;
}

// CSV-Export: export current wishlist
async function exportWishlistCSV(userId, options = {}) {
  const wishlist = await resolveWishlist(userId, {
    ...options,
    fallbackToAny: true,
    lean: true,
  });

  if (!wishlist) {
    throw new Error("No wishlist found for export");
  }

  const fields = ["strain", "note", "addedAt"];
  const parser = new Parser({ fields });
  const rows = Array.isArray(wishlist.items)
    ? wishlist.items.map((item) => ({
        strain: item.strain,
        note: item.note || "",
        addedAt: item.addedAt ? new Date(item.addedAt).toISOString() : "",
      }))
    : [];

  return parser.parse(rows);
}

module.exports = { importWishlistFromCSV, exportWishlistCSV };
