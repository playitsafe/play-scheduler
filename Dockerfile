# Base image with Playwright installed
FROM node:22.5.1-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies needed by Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libgtk-3-0 \
    ca-certificates \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

RUN npx playwright install chromium

# Copy the rest of your project
COPY . .

# Default headless mode
# ENV HEADLESS=true

# Command to run your script
CMD ["node", "src/index.js"]
