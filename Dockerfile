FROM node:16

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with retry mechanism
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set strict-ssl false && \
    for i in 1 2 3 4 5; do npm install && break || sleep 15; done

# Copy app source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]