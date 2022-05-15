FROM node:18-alpine3.14
WORKDIR /app
COPY ./api-authentication/package*.json ./
RUN npm install
COPY ./api-authentication .
EXPOSE 4501
CMD ["node","app.js"]
