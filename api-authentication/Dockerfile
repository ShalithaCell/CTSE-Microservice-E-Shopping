FROM node:18-alpine3.14
WORKDIR /app
COPY package*.json ./api-authentication
RUN npm install
COPY . .
EXPOSE 4500
CMD ["node","app.js"]
