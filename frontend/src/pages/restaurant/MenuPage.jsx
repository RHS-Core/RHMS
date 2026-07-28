import React, { useState } from 'react';

const RestaurantMenu = () => {
  
  const [menuItems, setMenuItems] = useState([
    // Khai vị
    {
      id: 1,
      name: 'Súp Hải Sản Bào Ngư',
      category: 'Khai vị',
      price: 180000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
      description: 'Súp thanh ngọt từ hải sản tươi sống và bào ngư thượng hạng.'
    },
    {
      id: 2,
      name: 'Salad Caesar Thịt Xông Khói',
      category: 'Khai vị',
      price: 95000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80',
      description: 'Rau xà lách giòn mát, bánh mì nướng giòn và sốt Caesar đặc biệt.'
    },
    {
      id: 3,
      name: 'Chả Giò Hải Sản Sốt Mayonnaise',
      category: 'Khai vị',
      price: 85000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80',
      description: 'Vỏ giòn rụm nhân tôm thịt đậm đà chấm kèm sốt béo ngậy.'
    },

    // Món chính (Có Phở, Bún bò, Pizza, Bò bít tết...)
    {
      id: 4,
      name: 'Phở Bò Tái Nạm Truyền Thống',
      category: 'Món chính',
      price: 75000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80',
      description: 'Nước dùng hầm xương ngọt thanh, bánh phở mềm và thịt bò tươi.'
    },
    {
      id: 5,
      name: 'Bún Bò Huế Đặc Biệt',
      category: 'Món chính',
      price: 85000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      description: 'Hương vị sả ớt đậm đà kèm giò heo, chả cua và thịt bò mềm.'
    },
    {
      id: 6,
      name: 'Pizza Hải Sản Phô Mai (Size L)',
      category: 'Món chính',
      price: 220000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
      description: 'Đế bánh giòn xốp ngập tràn tôm mực và lớp phô mai kéo sợi thơm phức.'
    },
    {
      id: 7,
      name: 'Bò Bit-tết Sốt Vang Đỏ',
      category: 'Món chính',
      price: 350000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      description: 'Thịt bò thăn nhập khẩu áp chảo kèm sốt vang đỏ Pháp đậm đà.'
    },
    {
      id: 8,
      name: 'Cá Hồi Nướng Sốt Bơ Chanh',
      category: 'Món chính',
      price: 290000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      description: 'Cá hồi Nauy áp chảo xém cạnh, sốt bơ chanh thơm béo.'
    },
    {
      id: 9,
      name: 'Mì Cay Hải Sản 7 Cấp Độ',
      category: 'Món chính',
      price: 95000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1612927601601-6638404738cbb?auto=format&fit=crop&w=600&q=80',
      description: 'Mì Hàn Quốc cay nồng chuẩn vị kèm tôm, mực, bò và nấm kim châm.'
    },
    {
      id: 10,
      name: 'Mì Ý Sốt Kem Hải Sản',
      category: 'Món chính',
      price: 160000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281298?auto=format&fit=crop&w=600&q=80',
      description: 'Mì Ý sợi dai quyện cùng sốt kem ngậy và tôm mực tươi ngon.'
    },
    {
      id: 11,
      name: 'Gà Rán Sốt Cay Hàn Quốc',
      category: 'Món chính',
      price: 140000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
      description: 'Đùi gà giòn rụm áo sốt cay ngọt chuẩn vị Hàn Quốc.'
    },

    // Tráng miệng
    {
      id: 12,
      name: 'Bánh Tiramisu Ý',
      category: 'Tráng miệng',
      price: 85000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
      description: 'Bánh Tiramisu truyền thống mềm mịn, đắng nhẹ vị cà phê.'
    },
    {
      id: 13,
      name: 'Chè Khúc Bạch Hạt Chia',
      category: 'Tráng miệng',
      price: 45000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
      description: 'Thanh mát, ngọt dịu kết hợp hạnh nhân và nhãn lồng.'
    },
    {
      id: 14,
      name: 'Kem Vanilla Phủ Sốt Chocolate',
      category: 'Tráng miệng',
      price: 40000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
      description: 'Kem tươi mát lạnh tan chảy cùng sốt chocolate đậm đà.'
    },

    // Đồ uống
    {
      id: 15,
      name: 'Cocktail Mojito Bạc Hà',
      category: 'Đồ uống',
      price: 65000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      description: 'Thức uống giải nhiệt mát lạnh kết hợp chanh tươi và bạc hà.'
    },
    {
      id: 16,
      name: 'Trà Sữa Trân Châu Đường Đen',
      category: 'Đồ uống',
      price: 55000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1558857563-b371032b853e?auto=format&fit=crop&w=600&q=80',
      description: 'Trà sữa thơm béo kèm trân châu dẻo dai đượm vị đường đen.'
    },
    {
      id: 17,
      name: 'Nước Ép Cam Tươi Nguyên Chất',
      category: 'Đồ uống',
      price: 55000,
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
      description: 'Cam tươi vắt nguyên chất giàu vitamin C giải khát tức thì.'
    }
  ]);

  // Bộ lọc danh mục và tìm kiếm
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc danh sách món ăn
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrder = (itemName) => {
    alert(`Đã tạo đơn gọi món "${itemName}" tại bàn thành công!`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tiêu đề */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Thực đơn</h2>
        <p className="text-sm text-gray-500">Tìm món, sắp xếp và quản lý menu nhà hàng.</p>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm món ăn (Phở, Bún bò, Pizza...)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
        
        <div className="flex gap-2 w-full md:w-auto">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>Giá tăng dần</option>
            <option>Giá giảm dần</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>Tất cả trạng thái</option>
            <option>Còn món (Available)</option>
            <option>Hết món (Sold out)</option>
          </select>
        </div>
      </div>

      {/* Các nút chuyển Category (Danh mục) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lưới hiển thị danh sách món ăn dạng Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between hover:shadow-lg transition">
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-300" 
                  />
                  <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded shadow">
                    {item.status}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                  <p className="font-bold text-blue-600 text-lg">
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleOrder(item.name)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition text-sm shadow-sm"
                >
                  Tạo đơn tại bàn
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            Không tìm thấy món ăn phù hợp với từ khóa của bạn.
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;