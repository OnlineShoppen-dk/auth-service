FROM node:17-alpine
WORKDIR /app

COPY package*.json .

COPY prisma ./prisma/

COPY . .



COPY .env .

RUN echo "Environment variables:" && env


RUN npm install
RUN npx prisma migrate dev 
RUN npx prisma generate


EXPOSE 8080

CMD [ "npm", "start" ]
