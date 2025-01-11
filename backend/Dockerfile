FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

COPY .env.local .env

EXPOSE 3001
CMD ["node", "server.js"]