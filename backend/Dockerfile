# Use Debian-based Node image (compatible with Prisma)
FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the backend
RUN npm run build

ENV PORT=5050
EXPOSE 5050

CMD ["npm", "run", "start"]
