FROM node:lts as dependencies
WORKDIR /usr/src
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /usr/src
COPY . .
COPY --from=dependencies /usr/src/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /usr/src
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /usr/src/next.config.js ./
COPY --from=builder /usr/src/public ./public
COPY --from=builder /usr/src/.next ./.next
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]
