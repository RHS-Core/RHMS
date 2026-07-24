import React from "react";
import { Row, Col } from "react-bootstrap";
import RoomCard from "../../components/RoomCard";

import room1 from "../../assets/images/room1.png";
import room2 from "../../assets/images/room2.png";
import vip1 from "../../assets/images/vip1.png";
import vip2 from "../../assets/images/vip2.png";

const rooms = [
  {
    id: 1,
    roomNumber: "101",
    type: "Standard",
    capacity: 2,
    price: 500000,
    status: "Trống",
    image: room1,
  },
  {
    id: 2,
    roomNumber: "102",
    type: "Standard",
    capacity: 2,
    price: 600000,
    status: "Đã đặt",
    image: room2,
  },
  {
    id: 3,
    roomNumber: "201",
    type: "VIP",
    capacity: 4,
    price: 1200000,
    status: "Trống",
    image: vip1,
  },
  {
    id: 4,
    roomNumber: "202",
    type: "VIP",
    capacity: 4,
    price: 1500000,
    status: "Đang sử dụng",
    image: vip2,
  },
];

function Rooms() {
  return (
    <>
      <h2 className="mb-4">Quản lý phòng</h2>

      <Row>
        {rooms.map((room) => (
          <Col md={4} lg={3} key={room.id} className="mb-4">
            <RoomCard room={room} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Rooms;