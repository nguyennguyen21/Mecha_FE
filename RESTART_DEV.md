# Hướng dẫn Restart Dev Server

## Khi gặp lỗi ERR_SSL_PROTOCOL_ERROR hoặc URL không đúng

### Bước 1: Dừng Dev Server
Nhấn `Ctrl+C` trong terminal đang chạy `npm run dev`

### Bước 2: Xóa Cache Vite
```bash
cd Mecha_FE
rm -rf node_modules/.vite
```

### Bước 3: Kiểm tra .env
Đảm bảo `.env` có nội dung đúng:
```env
VITE_BASE_URL=http://testsv.shinelord.net:30052
```

**Lưu ý**: Dùng `http://` (không phải `https://`) vì backend chưa có SSL.

### Bước 4: Restart Dev Server
```bash
npm run dev
```

### Bước 5: Hard Refresh Browser
- **Chrome/Edge**: `Ctrl+Shift+R` (Windows/Linux) hoặc `Cmd+Shift+R` (Mac)
- **Firefox**: `Ctrl+F5` (Windows/Linux) hoặc `Cmd+Shift+R` (Mac)
- Hoặc mở DevTools → Network tab → Check "Disable cache"

## Nếu vẫn còn lỗi

1. Kiểm tra console để xem URL nào đang được gọi
2. Đảm bảo không có hardcode `https://` trong code
3. Xóa browser cache hoặc dùng Incognito/Private mode

