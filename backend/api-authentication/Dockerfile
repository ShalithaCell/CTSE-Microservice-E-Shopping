FROM node:18-alpine3.14
WORKDIR /app
COPY ./backend/api-authentication/package*.json ./
RUN npm install
COPY ./backend/api-authentication .
EXPOSE 4500
CMD ["node","app.js"]
