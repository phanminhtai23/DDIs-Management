# Dockerfile cho React Frontend với Node.js serve
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies và serve package
RUN npm ci --only=production && npm install -g serve

# Copy source code
COPY . .


# Build args để inject environment variables
ARG REACT_APP_BASE_BACKEND_URL=http://localhost:8015
ENV REACT_APP_BASE_BACKEND_URL=$REACT_APP_BASE_BACKEND_URL

# Build the React app
RUN npm run build

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3002/ || exit 1

# Start với serve (tự động support React Router)
CMD ["serve", "-s", "build", "-l", "3002"]
