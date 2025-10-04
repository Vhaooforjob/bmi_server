# BMI Server API

## 🧩 Công nghệ sử dụng

- **Runtime:** Node.js `v20.11.1`
- **Framework:** Express.js
- **Cơ sở dữ liệu:** MongoDB với Mongoose ODM
- **Xác thực:** JSON Web Token (JWT)
- **Tài liệu API:** Swagger UI
- **Biến môi trường:** `dotenv`
- **Bảo mật & Logging:** `helmet`, `cors`, `morgan`
- **Development:** `nodemon` để tự động khởi động lại server.

---

## 📁 Cấu trúc thư mục

Dự án được cấu trúc theo hướng module hóa để dễ dàng bảo trì và mở rộng.
    ```bash
src/
├── config/           # Cấu hình kết nối DB, biến môi trường
│   ├── database.js     # Kết nối MongoDB (Mongoose)
│   └── swagger.js      # Cấu hình Swagger UI
│
├── models/           # Định nghĩa Mongoose Schemas
│   ├── user.model.js     # Model người dùng
│   ├── chat.model.js     # Model lưu lịch sử hội thoại
│   └── verificationCode.js # Model mã xác thực / OTP
│
├── controllers/      # Tầng xử lý logic cho request
│   ├── auth.controller.js  # Đăng ký, đăng nhập, xác thực
│   ├── chat.controller.js  # Xử lý chat với AI
│   └── user.controller.js  # CRUD thông tin người dùng
│
├── routes/           # Định nghĩa các endpoints
│   ├── auth.route.js
│   ├── chat.route.js
│   └── user.route.js
│
├── middlewares/      # Middleware (xác thực, log, validate)
│   ├── auth.middleware.js  # Kiểm tra JWT token
│   └── error.middleware.js # Bắt lỗi toàn cục
│
├── services/         # Tầng xử lý business logic
│   ├── chat.service.js   # Tương tác với Gemini/OpenAI API
│   └── user.service.js
│
├── utils/            # Các hàm tiện ích (helpers)
│   ├── token.util.js     # Tạo và xác thực JWT
│   └── response.util.js  # Chuẩn hóa format JSON response
│
├── cronjobs/         # Tác vụ chạy theo lịch
│   └── cleanup.job.js    # Xóa logs, token hết hạn...
│
├── index.js          # Entry point của server
└── app.js            # Khởi tạo Express app, middlewares, routes


---

## 🚀 Bắt đầu

### Yêu cầu

- [Node.js](https://nodejs.org/) (v20.x hoặc cao hơn)
- [MongoDB](https://www.mongodb.com/) (cài đặt local hoặc sử dụng dịch vụ cloud như MongoDB Atlas)

### Cài đặt

1.  **Clone repository:**
    ```bash
    git clone <your-repository-url>
    cd bmi_server
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```

3.  **Tạo file biến môi trường:**
    Tạo một file `.env` ở thư mục gốc và sao chép nội dung từ file `.env.example` (nếu có) hoặc sử dụng mẫu dưới đây:

    ```env
    # Ví dụ cho MongoDB chạy local:
    # MONGO_CLUSTER=mongodb://127.0.0.1:27017

    MONGO_USERNAME=
    MONGO_PASSWORD=
    MONGO_CLUSTER=
    MONGO_DB=bmi
    JWT_SECRET=your_secret_key
    JWT_EXPIRE=30d
    JWT_REFRESH_SECRET=your_secret_key
    JWT_REFRESH_EXPIRE=90d
    PORT_SERVER = 3333

    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GOOGLE_CALLBACK_URL=
    GOOGLE_REDIRECT_URIS=

    GEMINI_API_KEY=

    SMTP_EMAIL=
    SMTP_PASS=

    FOLDER_ID=
    ```

### Chạy ứng dụng

- **Chế độ Development (với Nodemon):**
  Server sẽ tự động khởi động lại khi có thay đổi trong mã nguồn.
  ```bash
  npm run dev
Chế độ Production:

Bash

npm start
Sau khi khởi động thành công, server sẽ chạy tại http://localhost:3333.

📖 Tài liệu API
Tài liệu API được tạo tự động bằng Swagger. Truy cập đường dẫn sau khi server đã chạy:

http://localhost:3333/api-docs