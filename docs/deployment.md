# Deployment Guide

Guidelines for deploying AuthSphere to production environments.

- Environment Variables
- Database Setup (MongoDB)
- Docker Swarm / Kubernetes
- Reverse Proxy Configuration (Nginx/Traefik)

## Environment Variables

Before deploying, ensure the following environment variables are configured in your `.env` file for the API Engine:

```env
PORT=8000
MONGODB_URI=mongodb://user:pass@host:27017/authsphere
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
ENCRYPTION_KEY=32-byte-hex-string-for-aes-256-gcm
ADMIN_API_KEY=your-secure-admin-key
```

## Database Setup (MongoDB)

AuthSphere requires a MongoDB instance (v5.0+ recommended). For production:
- Ensure the database is secured with authentication.
- Enable TLS/SSL for database connections.
- It is highly recommended to use MongoDB Atlas for managed backups and scaling.

## Docker Swarm / Kubernetes

The provided `docker-compose.yml` is intended for local development. For production:
- **Docker Swarm**: Use `docker stack deploy` with a `docker-compose.prod.yml` that includes resource limits and replicas.
- **Kubernetes**: Create Deployments for the `backend` and `frontend`, and expose them via Services and an Ingress controller. Use Kubernetes Secrets to manage the environment variables.

## Reverse Proxy Configuration (Nginx/Traefik)

Place AuthSphere behind a reverse proxy to handle SSL termination.

**Example Nginx Snippet for API Engine:**
```nginx
server {
    listen 443 ssl;
    server_name api.authsphere.example.com;

    ssl_certificate /etc/letsencrypt/live/authsphere/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/authsphere/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support for telemetry
    location /socket.io/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```
