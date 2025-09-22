class FakeQuery {
  constructor(doc) {
    this.doc = doc || null;
  }

  sort() {
    return this;
  }

  async lean() {
    if (!this.doc) return null;
    return this.doc.toObject();
  }

  then(resolve, reject) {
    return Promise.resolve(this.doc).then(resolve, reject);
  }
}

class FakeWishlist {
  constructor(doc = {}) {
    this._id = doc._id || FakeWishlist.generateId();
    this.userId = doc.userId;
    this.name = doc.name;
    this.items = Array.isArray(doc.items)
      ? doc.items.map((item) => ({ ...item }))
      : [];
    this.createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();
    this.updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : new Date();
  }

  static generateId() {
    FakeWishlist._counter += 1;
    return FakeWishlist._counter.toString();
  }

  static async deleteMany() {
    FakeWishlist._data = [];
  }

  static findOne(filter = {}) {
    const doc = FakeWishlist._findOne(filter);
    return new FakeQuery(doc ? new FakeWishlist(doc) : null);
  }

  static _findOne(filter = {}) {
    const normalized = {
      _id: filter._id != null ? filter._id.toString() : undefined,
      userId: filter.userId != null ? filter.userId.toString() : undefined,
      name: filter.name,
    };

    const matches = FakeWishlist._data.filter((entry) => {
      if (normalized._id && entry._id !== normalized._id) return false;
      if (normalized.userId && entry.userId !== normalized.userId) return false;
      if (normalized.name && entry.name !== normalized.name) return false;
      return true;
    });

    if (matches.length === 0) {
      return null;
    }

    if (normalized._id || normalized.name) {
      return matches[0];
    }

    const sorted = [...matches].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
    return sorted[0];
  }

  static _persist(doc) {
    const snapshot = {
      _id: doc._id,
      userId: doc.userId,
      name: doc.name,
      items: doc.items.map((item) => ({
        strain: item.strain,
        note: item.note,
        addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    const idx = FakeWishlist._data.findIndex((entry) => entry._id === doc._id);
    if (idx >= 0) {
      FakeWishlist._data[idx] = snapshot;
    } else {
      FakeWishlist._data.push(snapshot);
    }
  }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      name: this.name,
      items: this.items.map((item) => ({
        strain: item.strain,
        note: item.note,
        addedAt: item.addedAt ? new Date(item.addedAt) : undefined,
      })),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  async save() {
    this.updatedAt = new Date();
    this.items = this.items.map((item) => ({
      strain: item.strain,
      note: item.note,
      addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
    }));
    FakeWishlist._persist(this);
    return this;
  }
}

FakeWishlist._data = [];
FakeWishlist._counter = 0;

const wishlistModelPath = require.resolve("../models/Wishlist");
require.cache[wishlistModelPath] = { exports: FakeWishlist };

const {
  importWishlistFromCSV,
  exportWishlistCSV,
} = require("../services/wishlistCSVService");
const Wishlist = require("../models/Wishlist");

async function run() {
  await Wishlist.deleteMany();
  const userId = "test-user";
  const importMessage = await importWishlistFromCSV(userId);
  const wishlistDoc = await Wishlist.findOne({ userId }).lean();

  console.log(importMessage);
  console.log(
    `Wishlist name: ${wishlistDoc ? wishlistDoc.name : "<missing>"}`,
  );
  console.log(
    `Wishlist item count: ${
      wishlistDoc && Array.isArray(wishlistDoc.items)
        ? wishlistDoc.items.length
        : 0
    }`,
  );

  const exported = await exportWishlistCSV(userId);
  const [header, firstRow] = exported.split("\n");
  console.log("Exported CSV header:", header);
  if (firstRow) {
    console.log("First CSV row:", firstRow);
  }
}

run().catch((err) => {
  console.error("Wishlist CSV verification failed:", err);
  process.exitCode = 1;
});
