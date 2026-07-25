import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

function RoomCard({ room, onViewDetail }) {
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Trống':
        return 'success';
      case 'Đã đặt':
        return 'warning';
      case 'Đang sử dụng':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img
        variant="top"
        src={room.image}
        style={{ height: '180px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column justify-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title className="mb-0 fw-bold">Phòng {room.roomNumber}</Card.Title>
            <Badge bg={getBadgeVariant(room.status)}>{room.status}</Badge>
          </div>
          <Card.Text className="text-muted small mb-1">
            Loại: <strong>{room.type}</strong>
          </Card.Text>
          <Card.Text className="text-muted small mb-1">
            Sức chứa: <strong>{room.capacity} người</strong>
          </Card.Text>
          <Card.Text className="fw-bold text-primary mb-3">
            Giá: {Number(room.price).toLocaleString('vi-VN')}đ / đêm
          </Card.Text>
        </div>

        {/* Nút Xem chi tiết gắn sự kiện onClick */}
        <Button
          variant="primary"
          className="w-100"
          onClick={() => onViewDetail && onViewDetail(room)}
        >
          Xem chi tiết
        </Button>
      </Card.Body>
    </Card>
  );
}

export default RoomCard;