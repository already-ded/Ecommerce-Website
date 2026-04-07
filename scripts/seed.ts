import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // 1. Import bcrypt
import { User } from '../src/models/Users';
import { Profile } from '../src/models/Profile';
import { Product } from '../src/models/Products';
import { Shop } from '../src/models/Shop';
import { Address } from '../src/models/Address';

dotenv.config({ path: '.env.local' });

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connect to MongoDB successfully!");

    console.log("🧹 Đang làm sạch dữ liệu cũ...");
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Product.deleteMany({}),
      Shop.deleteMany({}),
      Address.deleteMany({})
    ]);

    // 2. Tạo mật khẩu đã được mã hóa
    const hashedPassword = await bcrypt.hash('123', 10); 

    console.log("👤 Creating Users (with Hashed Passwords)...");
    const admin = await User.create({ 
      email: 'admin@test.com', 
      password: hashedPassword, // Dùng mật khẩu đã hash
      role: 'admin' 
    });
    const seller = await User.create({ 
      email: 'seller@test.com', 
      password: hashedPassword, // Dùng mật khẩu đã hash
      role: 'customer', 
      shopStatus: 'active' 
    });
    const customer = await User.create({ 
      email: 'customer@test.com', 
      password: hashedPassword, // Dùng mật khẩu đã hash
      role: 'customer' 
    });

    console.log("📝 Creating Profiles...");
    await Profile.insertMany([
      { userId: admin._id, fullName: 'Admin Hệ Thống', phone: '0911222333', avatar: 'https://i.pravatar.cc/150?u=admin' },
      { userId: seller._id, fullName: 'Ngọc Nguyễn', phone: '0988777666', avatar: 'https://i.pravatar.cc/150?u=seller' },
      { userId: customer._id, fullName: 'Trần Thị Nhài', phone: '0123456789', avatar: 'https://i.pravatar.cc/150?u=customer' }
    ]);

    console.log("📍 Creating Addresses...");
    await Address.insertMany([
      {
        userId: customer._id,
        receiverName: 'Trần Thị Nhài',
        phoneNumber: '0123456789',
        province: 'Hà Nội',
        district: 'Quận Đống Đa',
        ward: 'Phường Láng Thượng',
        detailAddress: '456 Đường Láng',
        isDefault: true,
        addressType: 'office'
      },
      {
        userId: seller._id,
        receiverName: 'Ngọc Nguyễn',
        phoneNumber: '0988777666',
        province: 'Hà Nội',
        district: 'Quận Cầu Giấy',
        ward: 'Phường Dịch Vọng',
        detailAddress: '789 Xuân Thủy',
        isDefault: true,
        addressType: 'home'
      }
    ]);

    console.log("🏪 Creating Shops...");
    await Shop.create({
      ownerId: seller._id,
      shopName: 'MiniShop Official Store',
      businessEmail: 'contact@minishop.vn',
      status: 'active'
    });

    console.log("📦 Creating Products...");
    await Product.insertMany([
      {
        name: "Tai nghe Bluetooth Anker Soundcore",
        image: "/tai_nghe.jpg",
        galleryImages: ["/tai_nghe.jpg", "https://placehold.co/600x600/335347/ffffff/png?text=Anker+Side+View", "https://placehold.co/600x600/335347/ffffff/png?text=Anker+Box"],
        price: 890000,
        oldPrice: 1200000,
        rating: 4.5,
        category: "Điện tử",
        brand: "Anker",
        stock: 50,
        status: "available",
        description: "Tai nghe chống ồn chủ động, âm thanh Hi-Res chất lượng cao với thời lượng pin 40 giờ."
      },
      {
        name: "Điện thoại Xiaomi Redmi Note 12",
        image: "https://placehold.co/300x300/eab308/ffffff/png?text=Xiao",
        galleryImages: ["https://placehold.co/600x600/eab308/ffffff/png?text=Xiao+Main", "https://placehold.co/600x600/eab308/ffffff/png?text=Xiao+Back"],
        price: 4990000,
        oldPrice: 5490000,
        rating: 5,
        category: "Điện tử",
        brand: "Xiaomi",
        stock: 12,
        status: "available",
        description: "Màn hình AMOLED 120Hz mượt mà, chip Snapdragon 685 mạnh mẽ cho mọi tác vụ giải trí."
      },
      {
        name: "Laptop Dell Inspiron 15",
        image: "https://placehold.co/300x300/eab308/ffffff/png?text=Dell",
        galleryImages: ["https://placehold.co/600x600/eab308/ffffff/png?text=Dell+Open", "https://placehold.co/600x600/eab308/ffffff/png?text=Dell+Keyboard"],
        price: 14500000,
        oldPrice: 15900000,
        rating: 4,
        category: "Laptop",
        brand: "Dell",
        stock: 5,
        status: "out_of_stock",
        description: "Laptop văn phòng mỏng nhẹ, hiệu năng ổn định với chip Core i5 và thiết kế sang trọng."
      },
      {
        name: "Balo chống nước Mikkor",
        image: "https://placehold.co/300x300/eab308/ffffff/png?text=Balo",
        galleryImages: ["https://placehold.co/600x600/eab308/ffffff/png?text=Balo+Front", "https://placehold.co/600x600/eab308/ffffff/png?text=Balo+Inside"],
        price: 490000,
        oldPrice: null,
        rating: 5,
        category: "Thời trang",
        brand: "Mikkor",
        stock: 200,
        status: "available",
        description: "Chất liệu vải Cordura siêu bền, chống thấm nước tuyệt đối, ngăn chứa laptop chuyên dụng."
      },
      {
        name: "Áo Khoác Dù Nam Cao Cấp",
        image: "https://placehold.co/300x300/eab308/ffffff/png?text=Jacket",
        galleryImages: ["https://placehold.co/600x600/eab308/ffffff/png?text=Jacket+Blue", "https://placehold.co/600x600/eab308/ffffff/png?text=Jacket+Black"],
        price: 350000,
        oldPrice: 450000,
        rating: 4,
        category: "Thời trang",
        brand: "OEM",
        stock: 80,
        status: "available",
        description: "Áo khoác dù 2 lớp, chống gió và nắng nhẹ, phong cách trẻ trung năng động."
      },
      {
        name: "Tủ Lạnh 2 Cánh Samsung Inverter",
        image: "https://placehold.co/300x300/8b5cf6/ffffff/png?text=Fridge",
        galleryImages: ["https://placehold.co/600x600/8b5cf6/ffffff/png?text=Fridge+Open", "https://placehold.co/600x600/8b5cf6/ffffff/png?text=Fridge+Inside"],
        price: 9200000,
        oldPrice: null,
        rating: 3,
        category: "Gia dụng",
        brand: "Samsung",
        stock: 3,
        status: "available",
        description: "Công nghệ Inverter tiết kiệm điện, khử mùi kháng khuẩn hiệu quả, dung tích lớn."
      },
      {
        name: "Bộ Nồi Inox 3 Chiếc Elmich",
        image: "https://placehold.co/300x300/065f46/ffffff/png?text=Pots",
        galleryImages: ["https://placehold.co/600x600/065f46/ffffff/png?text=Pots+Set", "https://placehold.co/600x600/065f46/ffffff/png?text=Pots+Detail"],
        price: 1500000,
        oldPrice: 1800000,
        rating: 5,
        category: "Gia dụng",
        brand: "Elmich",
        stock: 450,
        status: "available",
        description: "Chất liệu inox 304 an toàn cho sức khỏe, đáy 5 lớp truyền nhiệt đều, dùng được cho bếp từ."
      },
      {
        name: "Máy ảnh Canon EOS R100",
        image: "https://placehold.co/300x300/f06292/ffffff/png?text=Camera",
        galleryImages: ["https://placehold.co/600x600/f06292/ffffff/png?text=Camera+Body", "https://placehold.co/600x600/f06292/ffffff/png?text=Camera+Lens"],
        price: 18500000,
        oldPrice: null,
        rating: 4,
        category: "Điện tử",
        brand: "Canon",
        stock: 15,
        status: "available",
        description: "Máy ảnh Mirrorless nhỏ gọn nhất của Canon, hỗ trợ quay video 4K và lấy nét Dual Pixel."
      },
      {
        name: "Đồng hồ thông minh Huawei Watch GT 4",
        image: "https://placehold.co/300x300/4db6ac/ffffff/png?text=Watch",
        galleryImages: ["https://placehold.co/600x600/4db6ac/ffffff/png?text=Watch+Screen", "https://placehold.co/600x600/4db6ac/ffffff/png?text=Watch+Strap"],
        price: 5490000,
        oldPrice: 6000000,
        rating: 5,
        category: "Điện tử",
        brand: "Huawei",
        stock: 60,
        status: "available",
        description: "Pin lên đến 14 ngày, theo dõi sức khỏe chuyên sâu và hỗ trợ hơn 100 chế độ tập luyện."
      },
      {
        name: "Sạc dự phòng Anker PowerCore",
        image: "https://placehold.co/300x300/ffb74d/ffffff/png?text=Charger",
        galleryImages: ["https://placehold.co/600x600/ffb74d/ffffff/png?text=Charger+Input", "https://placehold.co/600x600/ffb74d/ffffff/png?text=Charger+Full"],
        price: 650000,
        oldPrice: null,
        rating: 4,
        category: "Điện tử",
        brand: "Anker",
        stock: 500,
        status: "available",
        description: "Dung lượng 10,000mAh, sạc nhanh PowerIQ độc quyền, thiết kế nhỏ gọn bền bỉ."
      },
      {
        name: "Ghế công thái học Herman Miller",
        image: "https://placehold.co/300x300/9e9e9e/ffffff/png?text=Chair",
        galleryImages: ["https://placehold.co/600x600/9e9e9e/ffffff/png?text=Chair+Front", "https://placehold.co/600x600/9e9e9e/ffffff/png?text=Chair+Back"],
        price: 30000000,
        oldPrice: 35000000,
        rating: 5,
        category: "Nội thất",
        brand: "Herman Miller",
        stock: 8,
        status: "out_of_stock",
        description: "Đỉnh cao ghế công thái học thế giới, hỗ trợ cột sống tuyệt đối cho người làm việc lâu."
      },
      {
        name: "Bàn phím cơ Dareu A98",
        image: "https://placehold.co/300x300/7986cb/ffffff/png?text=Keyboard",
        galleryImages: ["https://placehold.co/600x600/7986cb/ffffff/png?text=Keyboard+Top", "https://placehold.co/600x600/7986cb/ffffff/png?text=Keyboard+RGB"],
        price: 1990000,
        oldPrice: 2500000,
        rating: 4,
        category: "Thiết bị ngoại vi",
        brand: "Dareu",
        stock: 120,
        status: "available",
        description: "Gasket mount cực êm, hotswap, LED RGB 16.8 triệu màu, kết nối 3 chế độ linh hoạt."
      },
      {
        name: "Giày chạy bộ Adidas Ultraboost",
        image: "https://placehold.co/300x300/4dd0e1/ffffff/png?text=Shoes",
        galleryImages: ["https://placehold.co/600x600/4dd0e1/ffffff/png?text=Shoes+Side", "https://placehold.co/600x600/4dd0e1/ffffff/png?text=Shoes+Sole"],
        price: 3200000,
        oldPrice: null,
        rating: 5,
        category: "Thời trang",
        brand: "Adidas",
        stock: 40,
        status: "available",
        description: "Công nghệ đệm Boost hoàn trả năng lượng cực tốt, vải Primeknit ôm sát thoáng khí."
      },
      {
        name: "Kem chống nắng Biore UV",
        image: "https://placehold.co/300x300/ffcc80/ffffff/png?text=Cosmetic",
        galleryImages: ["https://placehold.co/600x600/ffcc80/ffffff/png?text=Cosmetic+Bottle", "https://placehold.co/600x600/ffcc80/ffffff/png?text=Cosmetic+Pack"],
        price: 250000,
        oldPrice: 300000,
        rating: 4,
        category: "Mỹ phẩm",
        brand: "Biore",
        stock: 350,
        status: "available",
        description: "Chỉ số SPF50+ PA++++, dạng gel mỏng nhẹ thấm nhanh, không gây bết rít cho da."
      },
      {
        name: "Máy hút bụi cầm tay Xiaomi",
        image: "https://placehold.co/300x300/c5e1a5/ffffff/png?text=Vacuum",
        galleryImages: ["https://placehold.co/600x600/c5e1a5/ffffff/png?text=Vacuum+Full", "https://placehold.co/600x600/c5e1a5/ffffff/png?text=Vacuum+Head"],
        price: 1900000,
        oldPrice: 2200000,
        rating: 4,
        category: "Gia dụng",
        brand: "Xiaomi",
        stock: 65,
        status: "available",
        description: "Lực hút mạnh mẽ, thiết kế không dây tiện lợi, màng lọc HEPA ngăn bụi mịn hiệu quả."
      }
    ]);

    console.log("✅ Seed Data Successful!");
  } catch (error) {
    console.error("❌ Seed Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

runSeed();