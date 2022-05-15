FROM node:18-alpine3.14
WORKDIR /abc_auth
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4500
CMD ["node","app.js"]
