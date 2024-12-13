FROM node:17.1.0

WORKDIR /backend

COPY . .

RUN apt-get update

RUN npm install -g npm@latest

RUN npm install -g @medusajs/medusa-cli@latest

RUN npm install --loglevel=error

RUN npm install

ENTRYPOINT [""]