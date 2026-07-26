import React, { useState, useMemo } from "react";
import { Row, Col, Form, Card, Modal, Button, Badge } from "react-bootstrap";
import RoomCard from "../../components/RoomCard";

// Import đầy đủ các file ảnh phòng thường
import room1 from "../../assets/images/room1.png";
import room2 from "../../assets/images/room2.png";
import room3 from "../../assets/images/room3.png";
import room4 from "../../assets/images/room4.png";
import room5 from "../../assets/images/room5.png";
import room6 from "../../assets/images/room6.png";
import room7 from "../../assets/images/room7.png";
import room8 from "../../assets/images/room8.png";
import room9 from "../../assets/images/room9.png";

// Import đầy đủ các file ảnh phòng VIP
import vip1 from "../../assets/images/vip1.png";
import vip2 from "../../assets/images/vip2.png";
import vip3 from "../../assets/images/vip3.png";
import vip4 from "../../assets/images/vip4.png";
import vip5 from "../../assets/images/vip5.png";
import vip6 from "../../assets/images/vip6.png";
import vip7 from "../../assets/images/vip7.png";

const roomsData = [
  // --- 10 PHÒNG STANDARD (THƯỜNG) ---
  {
    id: 1,
    roomNumber: "101",
    type: "Standard",
    capacity: 2,
    price: 500000,
    status: "Trống",
    image: room1,
    floor: 1,
    description: "Phòng Standard trang nhã tầng 1, không gian thoáng mát.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Tủ lạnh", "Tivi HD"],
  },
  {
    id: 2,
    roomNumber: "102",
    type: "Standard",
    capacity: 2,
    price: 500000,
    status: "Đã đặt",
    image: room2,
    floor: 1,
    description: "Phòng Standard hướng sân vườn, đón ánh sáng tự nhiên.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Tivi HD"],
  },
  {
    id: 3,
    roomNumber: "103",
    type: "Standard",
    capacity: 2,
    price: 520000,
    status: "Trống",
    image: room3,
    floor: 1,
    description: "Phòng Standard cạnh giếng trời yên tĩnh.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Máy sấy tóc"],
  },
  {
    id: 4,
    roomNumber: "104",
    type: "Standard",
    capacity: 2,
    price: 500000,
    status: "Đang sử dụng",
    image: room4,
    floor: 1,
    description: "Phòng Standard ấm cúng, đầy đủ tiện nghi.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Ấm siêu tốc"],
  },
  {
    id: 5,
    roomNumber: "105",
    type: "Standard",
    capacity: 2,
    price: 550000,
    status: "Trống",
    image: room5,
    floor: 1,
    description: "Phòng Standard góc rộng rãi, giường đôi lớn.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Tủ lạnh mini"],
  },
  {
    id: 6,
    roomNumber: "201",
    type: "Standard",
    capacity: 2,
    price: 550000,
    status: "Trống",
    image: room6,
    floor: 2,
    description: "Phòng Standard tầng 2 yên tĩnh.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Tivi HD"],
  },
  {
    id: 7,
    roomNumber: "202",
    type: "Standard",
    capacity: 2,
    price: 550000,
    status: "Đã đặt",
    image: room7,
    floor: 2,
    description: "Phòng Standard gọn gàng, nội thất hiện đại.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Bàn làm việc"],
  },
  {
    id: 8,
    roomNumber: "203",
    type: "Standard",
    capacity: 2,
    price: 580000,
    status: "Trống",
    image: room8,
    floor: 2,
    description: "Phòng Standard tầng 2 có ban công thoáng mát.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Ban công"],
  },
  {
    id: 9,
    roomNumber: "204",
    type: "Standard",
    capacity: 2,
    price: 550000,
    status: "Trống",
    image: room9,
    floor: 2,
    description: "Phòng Standard tiện nghi cho khách công tác.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Bàn làm việc"],
  },
  {
    id: 10,
    roomNumber: "205",
    type: "Standard",
    capacity: 2,
    price: 600000,
    status: "Đang sử dụng",
    image: room1, // Tái sử dụng room1 cho phòng 10
    floor: 2,
    description: "Phòng Standard rộng hơn với 2 giường.",
    amenities: ["Wifi miễn phí", "Điều hòa", "Tủ lạnh"],
  },

  // --- 8 PHÒNG VIP ---
  {
    id: 11,
    roomNumber: "301",
    type: "VIP",
    capacity: 4,
    price: 1200000,
    status: "Trống",
    image: vip1,
    floor: 3,
    description: "Phòng VIP tầng 3 đẳng cấp, nội thất cao cấp.",
    amenities: ["Wifi tốc độ cao", "Bồn tắm nằm", "Sofa tiếp khách"],
  },
  {
    id: 12,
    roomNumber: "302",
    type: "VIP",
    capacity: 4,
    price: 1300000,
    status: "Đã đặt",
    image: vip2,
    floor: 3,
    description: "Phòng VIP hướng thành phố, có quầy bar mini.",
    amenities: ["Wifi tốc độ cao", "Bồn tắm nằm", "Quầy bar mini"],
  },
  {
    id: 13,
    roomNumber: "303",
    type: "VIP",
    capacity: 4,
    price: 1250000,
    status: "Trống",
    image: vip3,
    floor: 3,
    description: "Phòng VIP không gian mở ngập tràn ánh sáng.",
    amenities: ["Wifi tốc độ cao", "Bồn tắm massage", "Ban công lớn"],
  },
  {
    id: 14,
    roomNumber: "304",
    type: "VIP",
    capacity: 4,
    price: 1400000,
    status: "Đang sử dụng",
    image: vip4,
    floor: 3,
    description: "Phòng VIP gia đình có khu phòng khách riêng.",
    amenities: ["Wifi tốc độ cao", "Smart TV 65 inch", "Bồn tắm"],
  },
  {
    id: 15,
    roomNumber: "401",
    type: "VIP",
    capacity: 4,
    price: 1500000,
    status: "Trống",
    image: vip5,
    floor: 4,
    description: "Phòng VIP Executive view bao quát thành phố.",
    amenities: ["Wifi tốc độ cao", "View toàn cảnh", "Ăn sáng miễn phí"],
  },
  {
    id: 16,
    roomNumber: "402",
    type: "VIP",
    capacity: 4,
    price: 1500000,
    status: "Trống",
    image: vip6,
    floor: 4,
    description: "Phòng VIP Executive âm thanh vòm hiện đại.",
    amenities: ["Wifi tốc độ cao", "Loa Bluetooth", "Két sắt"],
  },
  {
    id: 17,
    roomNumber: "403",
    type: "VIP",
    capacity: 4,
    price: 1600000,
    status: "Đã đặt",
    image: vip7,
    floor: 4,
    description: "Phòng Presidential VIP phong cách hoàng gia.",
    amenities: ["Wifi tốc độ cao", "Bồn Jacuzzi", "Rượu vang chào mừng"],
  },
  {
    id: 18,
    roomNumber: "404",
    type: "VIP",
    capacity: 4,
    price: 1800000,
    status: "Trống",
    image: vip1, // Tái sử dụng vip1 nếu thiếu vip8
    floor: 4,
    description: "Phòng Penthouse VIP cao nhất khách sạn.",
    amenities: ["Wifi tốc độ cao", "Sân thượng riêng", "Bồn Jacuzzi"],
  },
];

function Rooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedRoom, setSelectedRoom] = useState(null);

  const filteredRooms = useMemo(() => {
    return roomsData.filter((room) => {
      const matchSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === "ALL" || room.type === typeFilter;
      const matchStatus = statusFilter === "ALL" || room.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Quản lý phòng</h2>
        <Badge bg="secondary" className="fs-6 px-3 py-2">
          Tổng cộng: {filteredRooms.length} / {roomsData.length} phòng
        </Badge>
      </div>

      {/* Thanh Tìm kiếm và Bộ lọc */}
      <Card className="p-3 mb-4 border-0 shadow-sm">
        <Row className="g-3">
          <Col md={6} lg={4}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary">Tìm số phòng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số phòng (vd: 101, 301...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={3} lg={4}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary">Loại phòng</Form.Label>
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">Tất cả loại phòng</option>
                <option value="Standard">Standard (Thường)</option>
                <option value="VIP">VIP (Cao cấp)</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3} lg={4}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary">Trạng thái</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="Trống">Trống</option>
                <option value="Đã đặt">Đã đặt</option>
                <option value="Đang sử dụng">Đang sử dụng</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card>

      {/* Danh sách phòng */}
      <Row>
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <Col md={4} lg={3} key={room.id} className="mb-4">
              <RoomCard 
                room={room} 
                onViewDetail={(r) => setSelectedRoom(r)} 
              />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="text-center text-muted my-5 py-5 bg-white rounded shadow-sm">
              <h5>Không tìm thấy phòng phù hợp</h5>
            </div>
          </Col>
        )}
      </Row>

      {/* Modal Cửa sổ Chi Tiết */}
      {selectedRoom && (
        <Modal show={true} onHide={() => setSelectedRoom(null)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              Chi tiết Phòng {selectedRoom.roomNumber} - {selectedRoom.type}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.roomNumber}
                  className="img-fluid rounded shadow-sm w-100"
                  style={{ maxHeight: "260px", objectFit: "cover" }}
                />
              </Col>
              <Col md={6}>
                <h4 className="text-primary fw-bold mb-3">
                  {selectedRoom.price.toLocaleString("vi-VN")}đ / đêm
                </h4>
                <p className="mb-2"><strong>Tầng:</strong> Tầng {selectedRoom.floor}</p>
                <p className="mb-2"><strong>Loại phòng:</strong> {selectedRoom.type}</p>
                <p className="mb-2"><strong>Sức chứa:</strong> {selectedRoom.capacity} người</p>
                <p className="mb-2">
                  <strong>Trạng thái: </strong>
                  <Badge 
                    bg={
                      selectedRoom.status === "Trống" ? "success" : 
                      selectedRoom.status === "Đã đặt" ? "warning" : "danger"
                    }
                  >
                    {selectedRoom.status}
                  </Badge>
                </p>
                <p className="text-muted small mt-2">{selectedRoom.description}</p>
                
                <h6 className="fw-bold mt-3">Tiện ích bao gồm:</h6>
                <div>
                  {selectedRoom.amenities?.map((item, idx) => (
                    <Badge key={idx} bg="light" text="dark" className="me-1 mb-1 border">
                      ✓ {item}
                    </Badge>
                  ))}
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedRoom(null)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Rooms;