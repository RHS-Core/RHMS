import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

function RoomCard({ room }) {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Trống":
        return "success";
      case "Đã đặt":
        return "warning";
      case "Đang sử dụng":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Img
        variant="top"
        src={room.image}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body>
        <Card.Title>Phòng {room.roomNumber}</Card.Title>

        <p>
          <strong>Loại:</strong> {room.type}
        </p>

        <p>
          <strong>Sức chứa:</strong> {room.capacity} người
        </p>

        <p>
          <strong>Giá:</strong>{" "}
          {room.price.toLocaleString("vi-VN")}đ / đêm
        </p>

        <Badge bg={getStatusVariant(room.status)}>
          {room.status}
        </Badge>

        <div className="mt-3">
          <Button variant="primary" className="w-100">
            Xem chi tiết
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default RoomCard;