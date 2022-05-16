FROM node:18-alpine3.14
WORKDIR /server
COPY ./api-sales/package*.json ./
RUN npm install
COPY ./api-sales .
EXPOSE 5000
CMD ["node","server.js"]
