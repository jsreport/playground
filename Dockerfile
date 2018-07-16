FROM ubuntu:xenial
# not using ubuntu:bionic because phantomjs 1.9.8 does not work there
# (it contains a newer version of OpenSSL which can not be used with phantomjs)

RUN adduser --disabled-password --gecos "" jsreport && \
    apt-get update && \
    apt-get install -y --no-install-recommends libgconf-2-4 gnupg git curl wget ca-certificates && \   
    # node
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs docker.io && \
    npm i -g npm && \    
    # cleanup
    rm -rf /var/lib/apt/lists/* /var/cache/apt/* && \
    rm -rf /src/*.deb

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/package.json

RUN npm install && \
    npm cache clean -f && \
    rm -rf /tmp/*

COPY . /app

EXPOSE 5488

CMD ["node", "server.js"]