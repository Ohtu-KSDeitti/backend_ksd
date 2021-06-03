#Set node16 with alpine linux as the base image for this docker file
FROM node:16-alpine

#Create directory for app
WORKDIR /usr/src/app

#Copy package.json and package-lock.json to workdir
COPY package*.json ./

#Install packages specified in package.json
RUN npm install

#Dump source code to docker image
COPY . .

#Set PORT to 8082
ENV PORT=8082

#Open port 8082
EXPOSE 8082

#Start backend
CMD ["npm", "start"]
