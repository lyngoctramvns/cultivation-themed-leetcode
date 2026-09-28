FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/data

WORKDIR /app
COPY --chown=node:node . /app
RUN mkdir -p /data \
    && printf '{"player":{"name":"","dailyTarget":1},"problems":[],"settings":{}}\n' > /data/db.json \
    && printf '{}\n' > /data/truyenky.json \
    && chown -R node:node /data

USER node
EXPOSE 3000
CMD ["node", "server.js"]