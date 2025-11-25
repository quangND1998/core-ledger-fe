# Hướng dẫn Deploy lên Digital Ocean với Docker Hub

## Tổng quan

Hệ thống có 2 môi trường riêng biệt:

### Development (Dev)
- **Branch**: `develop`
- **Workflow**: `deploy-dev.yml`
- **Container name**: `core-ledger-fe-dev`
- **Port**: `8080`
- **Image tags**: `dev-{sha}`, `dev-latest`

### Production (Prod)
- **Branch**: `main`
- **Workflow**: `deploy-prod.yml`
- **Container name**: `core-ledger-fe`
- **Port**: `80`
- **Image tags**: `prod-{sha}`, `prod-latest`, `latest`

## Quy trình hoạt động

1. **Dev**: Push code lên branch `develop` → Tự động deploy lên dev server
2. **Prod**: Push code lên branch `main` → Tự động deploy lên production server

## Yêu cầu

- 2 Digital Ocean Droplets (hoặc 1 server với 2 ports khác nhau)
- SSH access đến cả 2 servers
- Docker đã được cài đặt trên cả 2 servers
- GitHub repository với Actions enabled
- Docker Hub account (miễn phí)

## Bước 1: Tạo Docker Hub Access Token

1. Đăng nhập vào [Docker Hub](https://hub.docker.com/)
2. Vào **Account Settings** > **Security** > **New Access Token**
3. Tạo token với quyền **Read & Write**
4. Copy token lại (chỉ hiện 1 lần)

## Bước 2: Cấu hình GitHub Secrets

Vào repository trên GitHub → **Settings** → **Secrets and variables** → **Actions**

Thêm các secrets sau:

### Secrets chung (dùng cho cả dev và prod):
| Secret Name | Giá trị | Ví dụ |
|------------|---------|-------|
| `DOCKER_USERNAME` | Docker Hub username | `your-dockerhub-username` |
| `DOCKER_PASSWORD` | Docker Hub Access Token | `dckr_pat_xxxxx...` |

### Secrets cho Dev:
| Secret Name | Giá trị | Ví dụ |
|------------|---------|-------|
| `DO_DEV_HOST` | IP của dev server | `206.189.33.14` |
| `DO_DEV_USERNAME` | Username SSH dev | `root` |
| `DO_DEV_PASSWORD` | Mật khẩu SSH dev | `your-dev-ssh-password` |
| `DEV_DOMAIN` | Domain dev (optional) | `dev.yourdomain.com` |

### Secrets cho Production:
| Secret Name | Giá trị | Ví dụ |
|------------|---------|-------|
| `DO_PROD_HOST` | IP của production server | `206.189.33.15` |
| `DO_PROD_USERNAME` | Username SSH prod | `root` |
| `DO_PROD_PASSWORD` | Mật khẩu SSH prod | `your-prod-ssh-password` |
| `PROD_DOMAIN` | Domain production (optional) | `yourdomain.com` |

**Lưu ý:** 
- Sử dụng Access Token cho Docker Hub, không dùng mật khẩu
- Nếu dùng cùng 1 server, có thể set cùng IP nhưng khác ports

## Bước 3: Cài đặt Docker trên Server

Nếu server chưa có Docker, chạy các lệnh sau trên cả 2 servers:

```bash
ssh root@YOUR_SERVER_IP

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Khởi động Docker
systemctl start docker
systemctl enable docker

# Kiểm tra Docker
docker --version
```

## Bước 4: Deploy tự động

### Development
- Push code lên branch `develop` → Tự động deploy lên dev server
- App sẽ chạy trên port `8080`

### Production
- Push code lên branch `main` → Tự động deploy lên production server
- App sẽ chạy trên port `80`

### Trigger manual deploy:

1. Vào tab **Actions** trên GitHub
2. Chọn workflow:
   - **Build and Deploy to Dev** (cho dev)
   - **Build and Deploy to Production** (cho prod)
3. Click **Run workflow**

## Kiểm tra deployment

### Dev Server:
```bash
# SSH vào dev server
ssh root@YOUR_DEV_SERVER_IP

# Kiểm tra container đang chạy
docker ps | grep core-ledger-fe-dev

# Xem logs
docker logs core-ledger-fe-dev

# Kiểm tra health
curl http://localhost:8080/health
```

### Production Server:
```bash
# SSH vào production server
ssh root@YOUR_PROD_SERVER_IP

# Kiểm tra container đang chạy
docker ps | grep core-ledger-fe

# Xem logs
docker logs core-ledger-fe

# Kiểm tra health
curl http://localhost/health
```

## Troubleshooting

### Container không start:

```bash
# Xem logs chi tiết
docker logs core-ledger-fe-dev  # cho dev
docker logs core-ledger-fe      # cho prod

# Kiểm tra port đã được sử dụng chưa
netstat -tulpn | grep :8080  # dev
netstat -tulpn | grep :80    # prod

# Kiểm tra image có tồn tại không
docker images | grep core-ledger-fe
```

### Lỗi authentication Docker Hub:

- Kiểm tra lại `DOCKER_USERNAME` và `DOCKER_PASSWORD` trong GitHub Secrets
- Đảm bảo sử dụng Access Token, không phải mật khẩu
- Token phải có quyền Read & Write

### Cần rebuild:

```bash
# Trên server
docker stop core-ledger-fe-dev  # hoặc core-ledger-fe cho prod
docker rm core-ledger-fe-dev
docker rmi $(docker images '*/core-ledger-fe*' -q)

# Sau đó trigger lại GitHub Actions
```

### Xem images trên Docker Hub:

Truy cập: `https://hub.docker.com/r/YOUR_USERNAME/core-ledger-fe`

Bạn sẽ thấy các tags:
- `dev-{sha}` - Dev images
- `dev-latest` - Latest dev
- `prod-{sha}` - Production images
- `prod-latest` - Latest production
- `latest` - Latest production (alias)

## Rollback

### Rollback Dev:

```bash
ssh root@YOUR_DEV_SERVER_IP

# Xem các dev tags có sẵn
docker pull YOUR_USERNAME/core-ledger-fe:dev-{SHA}

# Stop container hiện tại
docker stop core-ledger-fe-dev
docker rm core-ledger-fe-dev

# Run với tag cũ
docker run -d \
  --name core-ledger-fe-dev \
  --restart unless-stopped \
  -p 8080:80 \
  YOUR_USERNAME/core-ledger-fe:dev-{SHA}
```

### Rollback Production:

```bash
ssh root@YOUR_PROD_SERVER_IP

# Xem các production tags có sẵn
docker pull YOUR_USERNAME/core-ledger-fe:prod-{SHA}

# Stop container hiện tại
docker stop core-ledger-fe
docker rm core-ledger-fe

# Run với tag cũ
docker run -d \
  --name core-ledger-fe \
  --restart unless-stopped \
  -p 80:80 \
  YOUR_USERNAME/core-ledger-fe:prod-{SHA}
```

## Environment Variables

Nếu cần thêm environment variables khác nhau cho dev và prod, có thể:

1. Sửa Dockerfile để nhận build args
2. Hoặc sử dụng docker run với `-e` flag trong workflow

Ví dụ trong workflow:
```yaml
docker run -d \
  --name core-ledger-fe-dev \
  -e BASE_URL=https://dev-api.example.com \
  -e APP_NAME=Core-Ledger-Dev \
  ...
```

## Setup Domain cho Dev và Production

### Bước 1: Cấu hình DNS trên Digital Ocean

1. Vào **Networking** > **Domains** trên Digital Ocean
2. Thêm domain của bạn (ví dụ: `yourdomain.com`)
3. Thêm 2 A records:
   - **Dev**: `dev` → trỏ đến IP dev server (`DO_DEV_HOST`)
   - **Prod**: `@` (hoặc `www`) → trỏ đến IP production server (`DO_PROD_HOST`)

Ví dụ:
```
Type    Name    Value           TTL
A       dev     206.189.33.14   3600
A       @       206.189.33.15   3600
A       www     206.189.33.15   3600
```

### Bước 2: Thêm Domain vào GitHub Secrets (Tự động setup nginx)

Thêm các secrets sau để tự động setup nginx config:

- `DEV_DOMAIN`: Domain dev (ví dụ: `dev.yourdomain.com`)
- `PROD_DOMAIN`: Domain production (ví dụ: `yourdomain.com`)

**Lưu ý**: Nếu không thêm secrets này, nginx sẽ dùng domain mặc định trong file config (`dev.yourdomain.com` và `yourdomain.com`). Bạn có thể sửa trực tiếp trong file `nginx-dev.conf` và `nginx-prod.conf` trước khi push code.

### Bước 3: Nginx tự động được setup khi deploy

Khi bạn push code và deploy, workflow sẽ tự động:
1. Upload nginx config lên server
2. Cài đặt nginx nếu chưa có
3. Tạo và enable nginx config
4. Reload nginx

**Không cần setup thủ công nữa!** Chỉ cần đảm bảo:
- DNS đã trỏ đúng IP
- Domain secrets đã được thêm vào GitHub (nếu muốn tự động thay domain)

### Bước 3: Setup SSL với Let's Encrypt (HTTPS)

#### Trên Dev Server:

```bash
# Cài đặt certbot
apt install -y certbot python3-certbot-nginx

# Tạo SSL certificate
certbot --nginx -d dev.yourdomain.com

# Auto-renewal (đã tự động setup)
certbot renew --dry-run
```

#### Trên Production Server:

```bash
# Cài đặt certbot
apt install -y certbot python3-certbot-nginx

# Tạo SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (đã tự động setup)
certbot renew --dry-run
```

Sau khi có SSL, certbot sẽ tự động cập nhật nginx config để redirect HTTP → HTTPS.

### Bước 4: Kiểm tra

- **Dev**: Truy cập `http://dev.yourdomain.com` hoặc `https://dev.yourdomain.com`
- **Prod**: Truy cập `http://yourdomain.com` hoặc `https://yourdomain.com`

## Port và Domain

- **Dev**: 
  - Container chạy trên port `8080` (internal)
  - Nginx reverse proxy: `dev.yourdomain.com` → `localhost:8080`
  - Truy cập: `http://dev.yourdomain.com` hoặc `https://dev.yourdomain.com`
  
- **Prod**: 
  - Container chạy trên port `80` (internal)
  - Nginx reverse proxy: `yourdomain.com` → `localhost:80`
  - Truy cập: `http://yourdomain.com` hoặc `https://yourdomain.com`

**Lưu ý**: Nếu dùng cùng 1 server cho cả dev và prod, cần đảm bảo nginx config đúng và containers chạy trên ports khác nhau (8080 cho dev, 80 cho prod).

## Lưu ý

- Mỗi commit sẽ tạo 1 image với tag là `dev-{sha}` hoặc `prod-{sha}`
- Tag `dev-latest` và `prod-latest` luôn trỏ đến commit mới nhất của branch tương ứng
- Docker Hub miễn phí cho public repos, private repos có giới hạn
- Image được cache trên server, chỉ pull khi có thay đổi
- Dev và Prod chạy độc lập, không ảnh hưởng lẫn nhau
