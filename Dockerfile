# Step 1: Base Image
FROM node:latest

# Install Bun
RUN npm install -g bun

# Step 2: Set Working Directory
WORKDIR /app

# Step 3: Copy Files
COPY . .

# Step 4: Install Dependencies
RUN bun install

# Step 5: Expose Port
EXPOSE 3000

# Step 6: Start Command
CMD ["bun", "run", "server.js"]