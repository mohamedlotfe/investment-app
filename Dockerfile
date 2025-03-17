FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# HEALTHCHECK --interval=30s --timeout=10s \
#     CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "dist/main.js"]
