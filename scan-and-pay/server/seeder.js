const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Inventory = require('./src/models/Inventory');
const Order = require('./src/models/Order');
const Payment = require('./src/models/Payment');
const Notification = require('./src/models/Notification');
const connectDB = require('./src/config/db');
const { generateReceiptId } = require('./src/utils/generateReceipt');

dotenv.config();

const sampleProducts = [
  {
    name: 'Amul Taaza Homogenised Toned Milk',
    barcode: '8901030000011',
    category: 'Dairy',
    brand: 'Amul',
    description: 'Fresh toned milk with vitamins A & D, ideal for daily nutrition and beverages.',
    price: 60,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    stock: 8, // Low stock on purpose for alerts!
    minimumStock: 15,
    unit: '1 Litre'
  },
  {
    name: 'Britannia 100% Whole Wheat Bread',
    barcode: '8901030000012',
    category: 'Bakery',
    brand: 'Britannia',
    description: 'Healthy and fiber-rich 100% whole wheat bread loaf.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    stock: 24,
    minimumStock: 10,
    unit: '400g'
  },
  {
    name: 'Amul Pasteurised Salted Butter',
    barcode: '8901030000013',
    category: 'Dairy',
    brand: 'Amul',
    description: 'Delicious creamy butter made from pure fresh milk fat.',
    price: 58,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    stock: 35,
    minimumStock: 10,
    unit: '100g'
  },
  {
    name: 'Go Cheese Slices Plain',
    barcode: '8901030000014',
    category: 'Dairy',
    brand: 'Go',
    description: 'Processed cheese slices packed with protein and calcium.',
    price: 135,
    image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=400&q=80',
    stock: 6, // Low stock!
    minimumStock: 10,
    unit: '200g (10 Slices)'
  },
  {
    name: 'Parle-G Gold Biscuits',
    barcode: '8901030000015',
    category: 'Snacks',
    brand: 'Parle',
    description: 'The classic Indian glucose biscuit enriched with wheat and milk goodness.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80',
    stock: 80,
    minimumStock: 25,
    unit: '1kg Pack'
  },
  {
    name: 'India Gate Basmati Rice Feast Rozzana',
    barcode: '8901030000016',
    category: 'Grains',
    brand: 'India Gate',
    description: 'Aromatic long-grain basmati rice perfect for daily pulao and biryani.',
    price: 185,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    stock: 45,
    minimumStock: 15,
    unit: '1kg'
  },
  {
    name: 'Aashirvaad Shudh Chakki Atta',
    barcode: '8901030000017',
    category: 'Grains',
    brand: 'Aashirvaad',
    description: '100% pure whole wheat grain flour for soft and fluffy rotis.',
    price: 260,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
    stock: 30,
    minimumStock: 10,
    unit: '5kg'
  },
  {
    name: 'Madhur Pure & Hygienic White Sugar',
    barcode: '8901030000018',
    category: 'Grocery',
    brand: 'Madhur',
    description: 'Sulphur-free, sparkling white refined sugar crystals.',
    price: 48,
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=400&q=80',
    stock: 75,
    minimumStock: 20,
    unit: '1kg'
  },
  {
    name: 'Tata Tea Gold Premium Tea',
    barcode: '8901030000019',
    category: 'Beverages',
    brand: 'Tata Tea',
    description: 'Exquisite blend of Assam CTC teas with 15% gently rolled long tea leaves.',
    price: 165,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    stock: 4, // Critical stock!
    minimumStock: 12,
    unit: '250g'
  },
  {
    name: 'Nescafe Classic 100% Pure Instant Coffee',
    barcode: '8901030000020',
    category: 'Beverages',
    brand: 'Nescafe',
    description: 'Rich aroma and bold coffee flavor crafted from premium Robusta beans.',
    price: 295,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    stock: 22,
    minimumStock: 10,
    unit: '100g Jar'
  },
  {
    name: 'Dove Cream Beauty Bathing Bar',
    barcode: '8901030000021',
    category: 'Personal Care',
    brand: 'Dove',
    description: 'Gentle cleansing moisturizing bar with 1/4th moisturizing cream.',
    price: 65,
    image: 'https://images.unsplash.com/photo-1607006314144-884813587b1c?auto=format&fit=crop&w=400&q=80',
    stock: 90,
    minimumStock: 25,
    unit: '100g'
  },
  {
    name: 'Pantene Pro-V Hair Fall Control Shampoo',
    barcode: '8901030000022',
    category: 'Personal Care',
    brand: 'Pantene',
    description: 'Nourishes hair from root to tip to significantly reduce breakage.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
    stock: 35,
    minimumStock: 10,
    unit: '180ml'
  },
  {
    name: 'Colgate MaxFresh Spicy Fresh Toothpaste',
    barcode: '8901030000023',
    category: 'Personal Care',
    brand: 'Colgate',
    description: 'Cooling crystal gel toothpaste providing long-lasting breath freshness.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1559591937-e10220268a7a?auto=format&fit=crop&w=400&q=80',
    stock: 55,
    minimumStock: 15,
    unit: '150g'
  },
  {
    name: 'Surf Excel Quick Wash Detergent Powder',
    barcode: '8901030000024',
    category: 'Household',
    brand: 'Surf Excel',
    description: 'Superior stain removal formulation with fast foam tech.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=400&q=80',
    stock: 40,
    minimumStock: 12,
    unit: '1kg'
  },
  {
    name: 'Fortune Sunlite Refined Sunflower Oil',
    barcode: '8901030000025',
    category: 'Grocery',
    brand: 'Fortune',
    description: 'Light and healthy cooking oil rich in natural Vitamin E.',
    price: 165,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
    stock: 50,
    minimumStock: 15,
    unit: '1 Litre Pouch'
  },
  {
    name: 'Tata Salt Vacuum Evaporated Iodized Salt',
    barcode: '8901030000026',
    category: 'Grocery',
    brand: 'Tata Salt',
    description: 'Desh Ka Namak, vacuum evaporated iodized purity guaranteed.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=400&q=80',
    stock: 110,
    minimumStock: 30,
    unit: '1kg'
  },
  {
    name: 'Real Fruit Power Mixed Fruit Juice',
    barcode: '8901030000027',
    category: 'Beverages',
    brand: 'Real',
    description: 'Refreshing blended fruit juice packed with natural goodness and vitamin C.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
    stock: 28,
    minimumStock: 10,
    unit: '1 Litre'
  },
  {
    name: 'Kelloggs Corn Flakes Original & Best',
    barcode: '8901030000028',
    category: 'Breakfast',
    brand: 'Kelloggs',
    description: 'Crispy golden toasted corn flakes enriched with iron and 8 essential vitamins.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=400&q=80',
    stock: 25,
    minimumStock: 10,
    unit: '475g Box'
  },
  {
    name: 'Lays Spanish Tomato Tango Potato Chips',
    barcode: '8901030000029',
    category: 'Snacks',
    brand: 'Lays',
    description: 'Tangy and crunchy crispy potato wafers made with highest grade potatoes.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
    stock: 140,
    minimumStock: 40,
    unit: '52g'
  },
  {
    name: 'Cadbury Dairy Milk Silk Chocolate Bar',
    barcode: '8901030000030',
    category: 'Snacks',
    brand: 'Cadbury',
    description: 'Smooth, creamy, and velvety melt-in-mouth milk chocolate.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80',
    stock: 60,
    minimumStock: 20,
    unit: '60g'
  },
  {
    name: 'Kissan Fresh Tomato Ketchup',
    barcode: '8901030000031',
    category: 'Spreads',
    brand: 'Kissan',
    description: 'Made from 100% real ripe tomatoes, the ultimate companion for snacks.',
    price: 125,
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
    stock: 35,
    minimumStock: 10,
    unit: '950g'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing collections...');
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Inventory.deleteMany(),
      Order.deleteMany(),
      Payment.deleteMany(),
      Notification.deleteMany()
    ]);

    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'Retail Admin',
      email: 'admin@scanpay.com',
      password: 'password123',
      phone: '9876543210',
      role: 'admin'
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '9876500001',
      role: 'customer'
    });

    const customer2 = await User.create({
      name: 'Sarah Sharma',
      email: 'sarah@example.com',
      password: 'password123',
      phone: '9876500002',
      role: 'customer'
    });

    const customer3 = await User.create({
      name: 'Alex Kumar',
      email: 'alex@example.com',
      password: 'password123',
      phone: '9876500003',
      role: 'customer'
    });

    console.log('Seeding Products...');
    const insertedProducts = await Product.insertMany(sampleProducts);

    console.log('Seeding Inventory & Stock Status...');
    const inventoryItems = insertedProducts.map(p => {
      let status = 'healthy';
      if (p.stock <= 0) status = 'critical';
      else if (p.stock <= p.minimumStock) status = 'low';

      return {
        productId: p._id,
        currentStock: p.stock,
        minimumStock: p.minimumStock,
        reorderLevel: p.minimumStock + 10,
        status,
        lastUpdated: new Date()
      };
    });
    await Inventory.insertMany(inventoryItems);

    console.log('Seeding Sample Orders & Transactions for Analytics...');
    // Create past orders across multiple days
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const sampleOrdersData = [
      {
        user: customer1,
        daysAgo: 4,
        items: [
          { product: insertedProducts[0], quantity: 2 }, // Milk
          { product: insertedProducts[1], quantity: 1 }, // Bread
          { product: insertedProducts[2], quantity: 1 }  // Butter
        ],
        method: 'UPI'
      },
      {
        user: customer2,
        daysAgo: 3,
        items: [
          { product: insertedProducts[0], quantity: 1 }, // Milk
          { product: insertedProducts[17], quantity: 1 }, // Corn Flakes
          { product: insertedProducts[4], quantity: 2 }  // Parle-G
        ],
        method: 'Card'
      },
      {
        user: customer1,
        daysAgo: 2,
        items: [
          { product: insertedProducts[5], quantity: 2 }, // Rice
          { product: insertedProducts[6], quantity: 1 }, // Atta
          { product: insertedProducts[14], quantity: 1 }, // Oil
          { product: insertedProducts[15], quantity: 2 }  // Salt
        ],
        method: 'UPI'
      },
      {
        user: customer3,
        daysAgo: 1,
        items: [
          { product: insertedProducts[8], quantity: 1 }, // Tea
          { product: insertedProducts[7], quantity: 2 }, // Sugar
          { product: insertedProducts[19], quantity: 3 } // Dairy Milk
        ],
        method: 'UPI'
      },
      {
        user: customer2,
        daysAgo: 0,
        items: [
          { product: insertedProducts[0], quantity: 2 }, // Milk
          { product: insertedProducts[3], quantity: 1 }, // Cheese
          { product: insertedProducts[18], quantity: 2 } // Chips
        ],
        method: 'Cashless Demo'
      }
    ];

    for (const data of sampleOrdersData) {
      let subtotal = 0;
      const orderItems = data.items.map(({ product, quantity }) => {
        const itemSubtotal = product.price * quantity;
        subtotal += itemSubtotal;
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          subtotal: itemSubtotal
        };
      });

      const tax = parseFloat((subtotal * 0.05).toFixed(2));
      const total = parseFloat((subtotal + tax).toFixed(2));
      const orderDate = new Date(now - data.daysAgo * dayMs);
      const receiptId = generateReceiptId();

      const order = await Order.create({
        userId: data.user._id,
        items: orderItems,
        subtotal,
        tax,
        discount: 0,
        total,
        paymentStatus: 'paid',
        orderStatus: 'completed',
        receiptId,
        createdAt: orderDate,
        updatedAt: orderDate
      });

      await Payment.create({
        orderId: order._id,
        userId: data.user._id,
        amount: total,
        paymentMethod: data.method,
        transactionId: `TXN_${orderDate.getTime()}_SEED`,
        status: 'completed',
        createdAt: orderDate
      });
    }

    console.log('Seeding Sample Notifications...');
    await Notification.create([
      {
        userId: customer1._id,
        title: '🎉 Welcome to Scan & Pay!',
        message: 'Experience queue-less self-checkout. Scan any barcode in store and pay instantly.',
        type: 'system'
      },
      {
        userId: customer1._id,
        title: '🔔 Weekend Grocery Deal',
        message: 'Get 10% instant discount on Dairy and Bakery items when you self-checkout.',
        type: 'promotional'
      },
      {
        userId: customer2._id,
        title: '🎉 Welcome to Scan & Pay!',
        message: 'Experience queue-less self-checkout. Scan any barcode in store and pay instantly.',
        type: 'system'
      }
    ]);

    console.log('====================================================');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('Admin Login:    admin@scanpay.com / password123');
    console.log('Customer Login: john@example.com  / password123');
    console.log(`Total Products: ${insertedProducts.length}`);
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Inventory.deleteMany(),
      Order.deleteMany(),
      Payment.deleteMany(),
      Notification.deleteMany()
    ]);
    console.log('Data Cleared!');
    process.exit(0);
  } catch (error) {
    console.error('Destroy Error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
