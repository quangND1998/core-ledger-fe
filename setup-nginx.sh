#!/bin/bash

# Script setup nginx reverse proxy cho dev và production
# Chạy script này trên server (có thể là cùng server hoặc 2 server riêng)

set -e

echo "=== Setup Nginx Reverse Proxy ==="

# Cài đặt nginx nếu chưa có
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    apt update
    apt install -y nginx
fi

# Tạo thư mục config
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Copy config files (bạn cần upload nginx-dev.conf và nginx-prod.conf lên server trước)
# Hoặc tạo trực tiếp trên server

echo "Setup completed!"
echo "Next steps:"
echo "1. Upload nginx-dev.conf và nginx-prod.conf lên server"
echo "2. Copy vào /etc/nginx/sites-available/"
echo "3. Tạo symlink: ln -s /etc/nginx/sites-available/nginx-dev.conf /etc/nginx/sites-enabled/"
echo "4. Tạo symlink: ln -s /etc/nginx/sites-available/nginx-prod.conf /etc/nginx/sites-enabled/"
echo "5. Test config: nginx -t"
echo "6. Reload nginx: systemctl reload nginx"

