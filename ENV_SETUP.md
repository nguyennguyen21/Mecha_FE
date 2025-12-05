# Environment Variables Setup

## File .env

Tạo file `.env` trong thư mục `Mecha_FE/` với nội dung:

```env
# Backend API Base URL
# Development: http://localhost:30052
# Production: https://your-api-domain.com
VITE_BASE_URL=http://localhost:30052
```

## Cách sử dụng

### Development (Local)
```env
VITE_BASE_URL=http://localhost:30052
```

### Production (Hosting)
```env
VITE_BASE_URL=https://your-api-domain.com
```

hoặc nếu có port:
```env
VITE_BASE_URL=https://your-api-domain.com:30052
```

## Lưu ý

1. **File `.env` không được commit lên Git** (đã có trong `.gitignore`)
2. **File `.env.example`** là template, có thể commit
3. Sau khi thay đổi `.env`, cần **restart dev server**:
   ```bash
   npm run dev
   ```
4. Tất cả API calls trong code đều tự động sử dụng `VITE_BASE_URL` từ environment variable

## Kiểm tra

Sau khi setup, kiểm tra xem env có được load đúng không:

```javascript
console.log(import.meta.env.VITE_BASE_URL);
```

Nếu không có `.env` hoặc `VITE_BASE_URL` không được set, sẽ dùng giá trị mặc định: `http://localhost:30052`
