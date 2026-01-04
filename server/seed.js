const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Medicine = require('./models/Medicine');

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://hridayeshkothamasu123_db_user:ZOtTIwD5nha706OH@cluster0.fyxovzw.mongodb.net/crop-advisory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected for seeding');
  seedDatabase();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedDatabase = async () => {
  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Product.deleteMany({});
    // await Medicine.deleteMany({});

    // Seed Products
    const products = [
      {
        name: 'Organic Fertilizer NPK 19:19:19',
        description: 'Balanced NPK fertilizer for all crops. Promotes healthy growth and high yield.',
        category: 'fertilizer',
        price: 850,
        stock: 100,
        rating: 4.5,
        image: ''
      },
      {
        name: 'Urea Fertilizer',
        description: 'High nitrogen content fertilizer ideal for leafy vegetables and rice crops.',
        category: 'fertilizer',
        price: 600,
        stock: 150,
        rating: 4.3,
        image: ''
      },
      {
        name: 'Neem Oil Pesticide',
        description: 'Organic pesticide made from neem oil. Safe for beneficial insects.',
        category: 'pesticide',
        price: 450,
        stock: 80,
        rating: 4.7,
        image: ''
      },
      {
        name: 'Bayer Crop Protection',
        description: 'Effective broad-spectrum pesticide for controlling various crop diseases.',
        category: 'pesticide',
        price: 1200,
        stock: 50,
        rating: 4.6,
        image: ''
      },
      {
        name: 'Hybrid Rice Seeds',
        description: 'High-yield hybrid rice seeds with disease resistance. Suitable for all seasons.',
        category: 'seed',
        price: 350,
        stock: 200,
        rating: 4.8,
        image: ''
      },
      {
        name: 'Wheat Seeds Premium',
        description: 'Premium quality wheat seeds with high germination rate and yield potential.',
        category: 'seed',
        price: 280,
        stock: 180,
        rating: 4.4,
        image: ''
      },
      {
        name: 'Sprayer Machine',
        description: 'Manual sprayer for pesticides and fertilizers. Easy to use and maintain.',
        category: 'equipment',
        price: 2500,
        stock: 30,
        rating: 4.2,
        image: ''
      },
      {
        name: 'Soil Testing Kit',
        description: 'Complete soil testing kit to check pH, NPK levels, and other nutrients.',
        category: 'equipment',
        price: 1800,
        stock: 25,
        rating: 4.9,
        image: ''
      }
    ];

    // Seed Medicines
    const medicines = [
      {
        name: 'Bavistin 50% WP',
        disease: 'Leaf Spot',
        cropType: 'Rice',
        priceCategory: 'low',
        price: 250,
        description: 'Effective fungicide for controlling leaf spot diseases in rice crops.',
        dosage: '2g per liter of water',
        effectiveness: 85,
        status: 'approved'
      },
      {
        name: 'Mancozeb 75% WP',
        disease: 'Leaf Spot',
        cropType: 'Rice',
        priceCategory: 'medium',
        price: 450,
        description: 'Broad-spectrum fungicide for leaf spot and blight diseases.',
        dosage: '2.5g per liter of water',
        effectiveness: 90,
        status: 'approved'
      },
      {
        name: 'Propiconazole 25% EC',
        disease: 'Leaf Spot',
        cropType: 'Rice',
        priceCategory: 'high',
        price: 750,
        description: 'Premium systemic fungicide with long-lasting protection against leaf spot.',
        dosage: '1ml per liter of water',
        effectiveness: 95,
        status: 'approved'
      },
      {
        name: 'Sulfur 80% WP',
        disease: 'Powdery Mildew',
        cropType: 'Wheat',
        priceCategory: 'low',
        price: 180,
        description: 'Organic fungicide for powdery mildew control in wheat.',
        dosage: '3g per liter of water',
        effectiveness: 80,
        status: 'approved'
      },
      {
        name: 'Tebuconazole 25% EC',
        disease: 'Powdery Mildew',
        cropType: 'Wheat',
        priceCategory: 'medium',
        price: 550,
        description: 'Systemic fungicide for effective powdery mildew management.',
        dosage: '1.5ml per liter of water',
        effectiveness: 92,
        status: 'approved'
      },
      {
        name: 'Azoxystrobin 23% SC',
        disease: 'Powdery Mildew',
        cropType: 'Wheat',
        priceCategory: 'high',
        price: 850,
        description: 'Advanced fungicide with excellent control of powdery mildew.',
        dosage: '1ml per liter of water',
        effectiveness: 96,
        status: 'approved'
      },
      {
        name: 'Copper Oxychloride 50% WP',
        disease: 'Blight',
        cropType: 'Tomato',
        priceCategory: 'low',
        price: 320,
        description: 'Contact fungicide for early blight and late blight in tomatoes.',
        dosage: '2g per liter of water',
        effectiveness: 82,
        status: 'approved'
      },
      {
        name: 'Chlorothalonil 75% WP',
        disease: 'Blight',
        cropType: 'Tomato',
        priceCategory: 'medium',
        price: 480,
        description: 'Protective fungicide for blight diseases in vegetables.',
        dosage: '2g per liter of water',
        effectiveness: 88,
        status: 'approved'
      },
      {
        name: 'Metalaxyl + Mancozeb',
        disease: 'Blight',
        cropType: 'Tomato',
        priceCategory: 'high',
        price: 920,
        description: 'Systemic and contact fungicide combination for complete blight control.',
        dosage: '2g per liter of water',
        effectiveness: 94,
        status: 'approved'
      },
      {
        name: 'Rust Control Basic',
        disease: 'Rust Disease',
        cropType: 'Wheat',
        priceCategory: 'low',
        price: 280,
        description: 'Basic fungicide for rust disease control in cereals.',
        dosage: '2.5g per liter of water',
        effectiveness: 78,
        status: 'approved'
      },
      {
        name: 'Triadimefon 25% WP',
        disease: 'Rust Disease',
        cropType: 'Wheat',
        priceCategory: 'medium',
        price: 520,
        description: 'Systemic fungicide for rust disease management.',
        dosage: '1g per liter of water',
        effectiveness: 90,
        status: 'approved'
      },
      {
        name: 'Flutriafol 12.5% SC',
        disease: 'Rust Disease',
        cropType: 'Wheat',
        priceCategory: 'high',
        price: 980,
        description: 'Premium systemic fungicide for rust disease with long residual activity.',
        dosage: '0.8ml per liter of water',
        effectiveness: 97,
        status: 'approved'
      }
    ];

    // Insert products
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(products);
      console.log(`✅ Seeded ${products.length} products`);
    } else {
      console.log(`ℹ️  Products already exist (${existingProducts} found). Skipping product seeding.`);
    }

    // Insert medicines
    const existingMedicines = await Medicine.countDocuments();
    if (existingMedicines === 0) {
      await Medicine.insertMany(medicines);
      console.log(`✅ Seeded ${medicines.length} medicines`);
    } else {
      console.log(`ℹ️  Medicines already exist (${existingMedicines} found). Skipping medicine seeding.`);
    }

    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

