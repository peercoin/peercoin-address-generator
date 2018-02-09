FROM smebberson/alpine-nginx

LABEL mantainer="Kazzkiq (peercoin.chat/direct/kazzkiq)"

# Adding NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY mimetypes.conf /etc/nginx/mimetypes.conf

# Adding web files
COPY public /usr/html/
