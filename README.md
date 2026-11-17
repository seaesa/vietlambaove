# Việc Làm Bảo Vệ

Chuyên trang việc làm ngành bảo vệ: tin tuyển dụng có lương, ca làm, chỗ ở ghi rõ; công ty được xác thực giấy phép; ứng viên không mất phí.

Trang tĩnh (HTML/CSS/JS thuần), định tuyến phía client bằng History API, không cần bước build.

## Chạy thử tại máy

```bash
node server.mjs      # http://localhost:8080
```

## Cấu trúc

```
index.html          khung trang, nạp CSS/JS
404.html            trang dự phòng
assets/css/site.css giao diện
assets/js/          core, router, data + pages/ (từng trang)
vercel.json         rewrite mọi URL sạch về index.html
```

## Triển khai

Vercel, tự động deploy khi push lên nhánh `main`.
