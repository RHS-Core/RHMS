# RHMS
# Thành viên nhóm gồm:
- Phan Thị Ngân Quỳnh - MSSV: 24100457
- Nghiêm Thị Mai Diễm - MSSV: 24107772
- Đặng Ngọc Khuê - MSSV: 2410049
---

# Restaurant & Hotel management system (RHMS) – Hệ thống quản lý Nhà hàng & Khách sạn

## Giới thiệu

RHMS là hệ thống web hỗ trợ quản lý hoạt động nhà hàng và khách sạn một cách tích hợp.
Hệ thống giúp tự động hóa quy trình vận hành, giảm sai sót và nâng cao hiệu quả làm việc.

---

## Mục tiêu

* Tự động hóa quy trình đặt bàn, đặt phòng, gọi món và thanh toán
* Xây dựng cơ chế phân quyền rõ ràng giữa các nhóm người dùng
* Hỗ trợ theo dõi và quản lý doanh thu

---

## Phân công công việc

| Tên                 | Vai trò     | Phụ trách                          |
| ------------------- | ----------- | ---------------------------------- |
| Phan Thị Ngân Quỳnh | Nhóm trưởng | Module Nhà hàng + Xác thực (Auth)         |
| Nghiêm Thị Mai Diễm                | Thành viên  | Module Khách sạn + Layout hệ thống |
| Đặng Ngọc Khuê                | Thành viên  | Module Dịch vụ & Thanh toán        |

---

## Chức năng chính

**Nhà hàng**

* Xem menu
* Đặt bàn
* Gọi món

**Khách sạn**

* Đặt phòng
* Check-in / Check-out
* Quản lý trạng thái phòng

**Dịch vụ & Thanh toán**

* Room service
* Mini bar
* Thanh toán và hóa đơn

---

## Phân quyền người dùng

* Khách hàng
* Nhân viên
* Quản lý
* Tổng quản lý

---

## Công nghệ sử dụng

* Backend: NodeJS, Express
* Frontend: React
* Database: MySQL

---

## Kiến trúc hệ thống

```id="8ojl2a"
Frontend → Backend API → Database → Backend → Frontend
```

Backend:

```id="o9j7fp"
Routes → Middleware → Controller → Service → Model → Database
```

# Git Workflow

* `main`: phiên bản ổn định
* `dev`: nhánh phát triển chính
* `feature/*`: nhánh phát triển tính năng

**Ví dụ:**

```
feature/restaurant-auth-quynh
feature/hotel-booking-diem
feature/payment-khue
```
