FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p uploads/cars uploads/profiles uploads/licenses uploads/misc

EXPOSE 5000

CMD ["node", "index.js"]
