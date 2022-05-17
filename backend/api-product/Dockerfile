FROM node:12.13.0

WORKDIR '/app'

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm","start"]
