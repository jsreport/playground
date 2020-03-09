FROM ubuntu:xenial-20200212
# not using ubuntu:bionic because phantomjs 1.9.8 does not work there
# (it contains a newer version of OpenSSL which can not be used with phantomjs)

RUN adduser --disabled-password --gecos "" jsreport && \
    apt-get update && \
    apt-get install -y --no-install-recommends libgconf-2-4 gnupg git curl wget ca-certificates bzip2 && \
    apt-get install -y --no-install-recommends docker.io && \
    # cleanup
    rm -rf /var/lib/apt/lists/* /var/cache/apt/* && \
    rm -rf /src/*.deb

RUN mkdir -p /app
RUN rm -rf /tmp/*

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 12.16.1

# node
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash && \
    /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /app

COPY package.json /app/package.json

RUN npm install --production && \
    npm cache clean -f && \
    rm -rf /tmp/*

COPY . /app

EXPOSE 5488

CMD ["node", "server.js"]
