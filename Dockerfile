#Install node.js
FROM node:14

#Setting WORKDIR
WORKDIR /dzulfiqar12/SejutaCita

#Copy package.json
COPY package*.json /dzulfiqar12/SejutaCita

#Install depedencies
RUN npm install

#Copy all aplication
COPY . /dzulfiqar12/SejutaCita

#Run 
EXPOSE 3000
CMD ["npm","start"]