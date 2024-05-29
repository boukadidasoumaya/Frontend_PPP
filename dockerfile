# pull official base image
FROM node:16-alpine 

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "start"]

EXPOSE 5000