const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch product by barcode
// @route   GET /api/products/barcode/:barcode
// @access  Public
const getProductByBarcode = async (req, res, next) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404);
      throw new Error('Product not found by barcode');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();

    // Create corresponding inventory record
    await Inventory.create({
      productId: createdProduct._id,
      currentStock: createdProduct.stock,
      minimumStock: createdProduct.minimumStock,
      reorderLevel: createdProduct.minimumStock + 10,
      status: createdProduct.stock <= createdProduct.minimumStock ? 'low' : 'healthy'
    });

    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, barcode, category, brand, description, price, image, stock, minimumStock, unit } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.barcode = barcode || product.barcode;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.description = description || product.description;
      product.price = price || product.price;
      product.image = image || product.image;
      product.stock = stock !== undefined ? stock : product.stock;
      product.minimumStock = minimumStock !== undefined ? minimumStock : product.minimumStock;
      product.unit = unit || product.unit;

      const updatedProduct = await product.save();

      // Update inventory record
      const inventory = await Inventory.findOne({ productId: product._id });
      if (inventory) {
        inventory.currentStock = updatedProduct.stock;
        inventory.minimumStock = updatedProduct.minimumStock;
        inventory.status = updatedProduct.stock <= updatedProduct.minimumStock ? 'low' : 'healthy';
        await inventory.save();
      }

      res.json({ success: true, data: updatedProduct });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create products (Admin)
// @route   POST /api/products/bulk
// @access  Private/Admin
const bulkCreateProducts = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      res.status(400);
      throw new Error('Please provide a non-empty products array');
    }

    if (products.length > 100) {
      res.status(400);
      throw new Error('Maximum 100 products per bulk import');
    }

    // Validate each product has required fields
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (!p.name || !p.barcode || !p.price || !p.category) {
        res.status(400);
        throw new Error(`Row ${i + 1}: name, barcode, price, and category are required`);
      }
    }

    // Check for duplicate barcodes within the batch
    const barcodes = products.map(p => p.barcode);
    const uniqueBarcodes = new Set(barcodes);
    if (uniqueBarcodes.size !== barcodes.length) {
      res.status(400);
      throw new Error('Duplicate barcodes found within the import batch');
    }

    // Check for existing barcodes in DB
    const existingProducts = await Product.find({ barcode: { $in: barcodes } }).select('barcode');
    if (existingProducts.length > 0) {
      const existing = existingProducts.map(p => p.barcode).join(', ');
      res.status(400);
      throw new Error(`Barcodes already exist in store: ${existing}`);
    }

    // Insert all products
    const createdProducts = await Product.insertMany(
      products.map(p => ({
        name: p.name,
        barcode: p.barcode,
        brand: p.brand || 'Generic',
        category: p.category,
        description: p.description || '',
        price: parseFloat(p.price),
        stock: parseInt(p.stock || 0),
        minimumStock: parseInt(p.minimumStock || 10),
        unit: p.unit || '1 Pack',
        image: p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        isActive: true
      }))
    );

    // Create inventory records for each
    await Inventory.insertMany(
      createdProducts.map(p => ({
        productId: p._id,
        currentStock: p.stock,
        minimumStock: p.minimumStock,
        reorderLevel: p.minimumStock + 10,
        status: p.stock <= p.minimumStock ? 'low' : 'healthy'
      }))
    );

    res.status(201).json({
      success: true,
      message: `${createdProducts.length} products imported successfully`,
      data: createdProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      await Inventory.deleteOne({ productId: product._id });
      res.json({ success: true, message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductByBarcode,
  createProduct,
  bulkCreateProducts,
  updateProduct,
  deleteProduct,
};
