const Order = require('../models/Order');
const Product = require('../models/Product');
const Recommendation = require('../models/Recommendation');

// Co-purchase category relationship map
const CATEGORY_AFFINITY_MAP = {
  'Dairy': ['Bakery', 'Beverages', 'Breakfast'],
  'Bakery': ['Dairy', 'Spreads', 'Beverages'],
  'Beverages': ['Snacks', 'Bakery', 'Breakfast'],
  'Snacks': ['Beverages', 'Dairy'],
  'Grains': ['Grocery', 'Dairy'],
  'Grocery': ['Grains', 'Household'],
  'Breakfast': ['Dairy', 'Beverages'],
  'Personal Care': ['Household'],
  'Household': ['Personal Care', 'Grocery'],
};

/**
 * Get smart recommendations for a specific user based on purchase history and affinity rules
 */
const getUserRecommendations = async (userId) => {
  // 1. Fetch user's completed orders
  const userOrders = await Order.find({ userId, paymentStatus: 'paid' })
    .sort({ createdAt: -1 })
    .limit(15);

  const purchasedProductIds = new Set();
  const purchasedCategories = new Set();

  userOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.productId) purchasedProductIds.add(item.productId.toString());
    });
  });

  if (purchasedProductIds.size > 0) {
    const purchasedProducts = await Product.find({ _id: { $in: [...purchasedProductIds] } });
    purchasedProducts.forEach(p => purchasedCategories.add(p.category));
  }

  // 2. Discover related target categories
  const targetCategories = new Set();
  purchasedCategories.forEach(cat => {
    const related = CATEGORY_AFFINITY_MAP[cat] || [];
    related.forEach(r => targetCategories.add(r));
    targetCategories.add(cat);
  });

  // 3. Find candidate recommended products
  let recommendedProducts = [];
  if (targetCategories.size > 0) {
    recommendedProducts = await Product.find({
      _id: { $nin: [...purchasedProductIds] },
      category: { $in: [...targetCategories] },
      stock: { $gt: 0 }
    }).limit(8);
  }

  // 4. Fallback for new customers or small catalogs: fill with top in-stock products
  if (recommendedProducts.length < 6) {
    const excludedIds = [...purchasedProductIds, ...recommendedProducts.map(p => p._id.toString())];
    const fallbackProducts = await Product.find({
      _id: { $nin: excludedIds },
      stock: { $gt: 0 }
    }).limit(6 - recommendedProducts.length);

    recommendedProducts = [...recommendedProducts, ...fallbackProducts];
  }

  // 5. Structure recommendations with confidence scores & rationale
  const results = recommendedProducts.map((product, idx) => {
    let reason = 'Trending in Smart Store';
    let score = 0.85;

    if (purchasedCategories.has(product.category)) {
      reason = `Frequently re-purchased in ${product.category}`;
      score = 0.94;
    } else if (purchasedCategories.size > 0) {
      reason = `Pairs well with your frequent grocery basket`;
      score = 0.91;
    }

    // Add slight variance to score
    score = parseFloat(Math.max(0.75, Math.min(0.99, score - idx * 0.02)).toFixed(2));

    return {
      product,
      reason,
      score
    };
  });

  // Save to Recommendation collection for user
  if (results.length > 0) {
    await Recommendation.deleteMany({ userId });
    await Recommendation.insertMany(
      results.map(r => ({
        userId,
        productId: r.product._id,
        reason: r.reason,
        score: r.score
      }))
    );
  }

  return results;
};

/**
 * Get store-wide top co-occurrence patterns for Admin overview
 */
const getCoOccurrenceMatrix = async () => {
  const completedOrders = await Order.find({ paymentStatus: 'paid' }).limit(100);
  const pairCounts = {};

  completedOrders.forEach(order => {
    const items = order.items.map(i => i.name);
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const pairKey = [items[i], items[j]].sort().join(' + ');
        pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
      }
    }
  });

  const sortedPairs = Object.entries(pairCounts)
    .map(([pair, count]) => ({ pair, frequency: count, confidence: Math.min(0.98, 0.75 + count * 0.05) }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  return sortedPairs;
};

module.exports = {
  getUserRecommendations,
  getCoOccurrenceMatrix
};
