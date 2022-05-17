FROM node:18-alpine3.14
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node","server.js"]
