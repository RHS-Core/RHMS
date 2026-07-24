import React, { useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(form);
      if (data.user.role === "SuperAdmin") {
        navigate("/");
      } else {
        setError("Chỉ Tổng quản lý được phép truy cập hệ thống");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="shadow-sm" style={{ width: "420px" }}>
        <Card.Body className="p-4">
          <h3 className="mb-3">Đăng nhập RHMS</h3>
          <p className="text-muted">Xác thực theo vai trò hệ thống</p>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control name="username" value={form.username} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Đăng nhập
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
