FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get upgrade
RUN apt-get install -y libxtst6 libnss3 libnspr4 libxss1 libasound2 libatk-bridge2.0-0 libgtk-3-0 libgdk-pixbuf2.0-0
RUN npm install



COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
