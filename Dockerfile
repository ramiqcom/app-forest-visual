FROM node:18

ARG titiler_endpoint

RUN mkdir /app
COPY package.json /app/
WORKDIR /app
COPY . ./

ENV TITILER_ENDPOINT=${titiler_endpoint}

RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run","start"]
