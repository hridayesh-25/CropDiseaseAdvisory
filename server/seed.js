const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Medicine = require('./models/Medicine');

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Error: MONGODB_URI is not set. Create a .env file in the server folder with MONGODB_URI.');
  process.exit(1);
}

mongoose.connect(mongoURI)
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
      }
    ];

    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(products);
      console.log(`✅ Seeded ${products.length} products`);
    }

    const existingMedicines = await Medicine.countDocuments();
    if (existingMedicines === 0) {
      await Medicine.insertMany(medicines);
      console.log(`✅ Seeded ${medicines.length} medicines`);
    }

    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};
