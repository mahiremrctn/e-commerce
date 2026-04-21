require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/dbConfig');
const Category = require('../models/Category');

const categories = [
  { name: 'Poster & Tablo', description: 'Özel tasarım posterler ve sanatsal duvar dekorları' },
  { name: '3D Baskı Tasarımlar', description: '3D yazıcı ile üretilmiş figürler ve fonksiyonel objeler' },
  { name: 'Süs Eşyaları', description: 'Eviniz için dekoratif biblolar ve estetik parçalar' },
  { name: 'Kırtasiye & Ofis', description: 'Defterler, kalemler ve yaratıcı ofis gereçleri' },
  { name: 'Küllük & Aksesuar', description: 'Özel tasarım küllükler ve kişisel aksesuarlar' },
  { name: 'Hediye Setleri', description: 'Farklı kategorilerden birleştirilmiş özel hediye paketleri' },
  { name: 'Mutfak Dekor', description: 'Tasarımsal kupa, altlık ve dekoratif mutfak gereçleri' }
];

const seedCategories = async () => {
  try {
    await connectDB();

    const operations = categories.map((category) => ({
      updateOne: {
        filter: { name: category.name },
        update: { $set: category },
        upsert: true,
      },
    }));

    const result = await Category.bulkWrite(operations, { ordered: false });
    const totalCategories = await Category.countDocuments();

    console.log('Category seed completed.');
    console.log(`Upserted: ${result.upsertedCount || 0}`);
    console.log(`Modified: ${result.modifiedCount || 0}`);
    console.log(`Matched: ${result.matchedCount || 0}`);
    console.log(`Total categories: ${totalCategories}`);
  } catch (error) {
    console.error('Category seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
  }
};

seedCategories();