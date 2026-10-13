/**
 * Generate a unique digital receipt ID
 * Format: SP-YYYY-XXXXX (e.g., SP-2026-84920)
 */
const generateReceiptId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SP-${year}-${randomNum}`;
};

module.exports = { generateReceiptId };
