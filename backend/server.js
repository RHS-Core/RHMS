import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// API test ban đầu
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: "Backend, check" });
});

// Cổng chạy server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đã chạy thành công tại port ${PORT}`);
});