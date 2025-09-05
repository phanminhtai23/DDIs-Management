FROM python:3.10.5-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libssl-dev \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgomp1 \
    libsm6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

ENV TORCH_ONLY_CPU=1


# Upgrade pip to latest version
RUN pip install --upgrade pip

COPY requirements.txt .

# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd -m -u 1000 fastapi && chown -R fastapi:fastapi /app
USER fastapi

EXPOSE 8015

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8015/docs || exit 1

CMD ["python", "main.py"]
