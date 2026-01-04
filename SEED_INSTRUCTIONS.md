# Database Seeding Instructions

## Why Seed Data?

The application needs initial data (products and medicines) to function properly. Without this data:
- Products page will be empty
- Medicine recommendations won't work
- Disease approvals won't have medicines to recommend

## How to Seed the Database

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Run the Seed Script
```bash
npm run seed
```

Or directly:
```bash
node seed.js
```

### Step 3: Verify Seeding
You should see output like:
```
✅ Seeded 8 products
✅ Seeded 12 medicines
✅ Database seeding completed!
```

## What Gets Seeded?

### Products (8 items)
- Fertilizers (NPK, Urea)
- Pesticides (Neem Oil, Bayer)
- Seeds (Rice, Wheat)
- Equipment (Sprayer, Soil Testing Kit)

### Medicines (12 items)
- Medicines for Leaf Spot (Low/Medium/High price)
- Medicines for Powdery Mildew (Low/Medium/High price)
- Medicines for Blight (Low/Medium/High price)
- Medicines for Rust Disease (Low/Medium/High price)

All medicines are pre-approved and ready to use.

## Important Notes

1. **Safe to Run Multiple Times**: The seed script checks if data exists and won't duplicate
2. **MongoDB Connection**: Make sure your MongoDB connection is working
3. **Environment Variables**: The seed script uses the same MongoDB URI from your `.env` file

## After Seeding

1. **Products**: Should appear in the User Dashboard → Products tab
2. **Medicines**: Will be available for specialist to recommend when approving diseases
3. **User Experience**: Users can now see products and get medicine recommendations

## Troubleshooting

If seeding fails:
1. Check MongoDB connection
2. Verify `.env` file has correct `MONGODB_URI`
3. Check server console for error messages
4. Ensure you're in the `server` directory when running the command

