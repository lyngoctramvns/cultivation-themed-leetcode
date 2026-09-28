FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/data

WORKDIR /app
COPY --chown=node:node . /app
RUN mkdir -p /data && chown node:node /data
COPY --chown=node:node db.json truyenky.json /data/

USER node
EXPOSE 3000
CMD ["node", "server.js"]