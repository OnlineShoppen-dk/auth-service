FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
EXPOSE 8080
CMD ["sh", "-c", "sleep 5 && npm run prisma:migrate && npm start"]
