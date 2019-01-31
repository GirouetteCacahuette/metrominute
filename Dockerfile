FROM httpd:2.4.33-alpine
RUN apk update && apk add nodejs git
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/
COPY ./src /usr/src/app
RUN npm install
RUN npm run build
RUN cp -R /usr/src/app/dist/* /usr/local/apache2/htdocs/
EXPOSE 80