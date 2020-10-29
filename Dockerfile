FROM node:14-alpine
ENV NODE_ENV = production
ENV PORT = 8000
WORKDIR /app
ADD package.json /app
RUN apk add python g++ make
RUN npm i --silent
COPY . /app
CMD npm run dev
