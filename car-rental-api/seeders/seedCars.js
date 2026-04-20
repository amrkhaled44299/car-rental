require('dotenv').config();
const { connectDB } = require('../config/database');
const { setupAssociations } = require('../models/associations');
const User = require('../models/User');
const Car  = require('../models/Car');

const seedCars = async () => {
  await connectDB();
  setupAssociations();

  let owner = await User.findOne({ where: { email: 'hassanahmed@gmail.com' } });
  if (!owner) {
    console.log('❌ Owner not found!');
    process.exit(1);
  }
  console.log('✅ Found owner:', owner.name);

  const cars = [
    {
      brand:'Toyota', model:'Corolla', year:2025, color:'White',
      plate_number:'ABC-1001', price_per_day:350, location:'Cairo',
      seats:5, transmission:'automatic', fuel_type:'hybrid',
      images: ['uploads/cars/2025-toyota-corolla-hybrid-5-887660.avif']
    },
    {
      brand:'Hyundai', model:'Elantra', year:2024, color:'Silver',
      plate_number:'ABC-1002', price_per_day:300, location:'Giza',
      seats:5, transmission:'automatic', fuel_type:'petrol',
      images: ['uploads/cars/2024-hyundai-elantra-limited-120-64ef85e5113c4.avif']
    },
    {
      brand:'Chevrolet', model:'Optra', year:2023, color:'Blue',
      plate_number:'ABC-1003', price_per_day:250, location:'Cairo',
      seats:5, transmission:'manual', fuel_type:'petrol',
      images: ['uploads/cars/1727292809_899_315371_chevrolet optra-scaled.jpg']
    },
    {
      brand:'Honda', model:'Civic', year:2034, color:'Red',
      plate_number:'ABC-1004', price_per_day:400, location:'Cairo',
      seats:5, transmission:'automatic', fuel_type:'petrol',
      images: ['uploads/cars/Acura-Integra-Type-S-Honda-Civic-Type-R-2034.jpg']
    },
    {
      brand:'BYD', model:'F3', year:2022, color:'Silver',
      plate_number:'ABC-1005', price_per_day:260, location:'Giza',
      seats:5, transmission:'automatic', fuel_type:'electric',
      images: ['uploads/cars/byd.jpg']
    },
    {
      brand:'Kia', model:'Cerato', year:2023, color:'Black',
      plate_number:'ABC-1006', price_per_day:320, location:'Alexandria',
      seats:5, transmission:'automatic', fuel_type:'petrol',
      images: ['uploads/cars/KIA c.avif']
    },
    {
      brand:'Nissan', model:'Sunny', year:2024, color:'White',
      plate_number:'ABC-1007', price_per_day:280, location:'Giza',
      seats:5, transmission:'automatic', fuel_type:'petrol',
      images: ['uploads/cars/listing_main_2024-Nissan-SUNNY-Exterior-2.jpg']
    },
    {
      brand:'Renault', model:'Logan', year:2023, color:'White',
      plate_number:'ABC-1008', price_per_day:230, location:'Mansoura',
      seats:5, transmission:'manual', fuel_type:'petrol',
      images: ['uploads/cars/renault.jpg']
    },
    {
      brand:'Toyota', model:'Yaris', year:2024, color:'Grey',
      plate_number:'ABC-1009', price_per_day:270, location:'Alexandria',
      seats:5, transmission:'manual', fuel_type:'petrol',
      images: ['uploads/cars/Toyota-Yaris-XP210-facelift-2024.jpg']
    },
    {
      brand:'MG', model:'MG6', year:2019, color:'Black',
      plate_number:'ABC-1010', price_per_day:450, location:'Cairo',
      seats:5, transmission:'automatic', fuel_type:'petrol',
      images: ['uploads/cars/2019-mg-mg6.jpg']
    },
  ];

  let created = 0;
  for (const carData of cars) {
    const existing = await Car.findOne({ where: { plate_number: carData.plate_number } });
    if (existing) { console.log('⚠️  Already exists:', carData.brand, carData.model); continue; }
    await Car.create({ ...carData, owner_id: owner.id, status: 'active', description: '' });
    console.log('✅ Added:', carData.brand, carData.model);
    created++;
  }

  console.log('\n🎉 Done! Added', created, 'cars.');
  process.exit(0);
};

seedCars().catch(err => { console.error('❌', err.message); process.exit(1); });
