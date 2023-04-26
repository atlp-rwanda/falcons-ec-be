FROM node:slim

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD [ "npm","run","dev"]