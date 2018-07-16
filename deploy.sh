#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t playground .
docker tag playground jsreport/playground:$TRAVIS_TAG
docker push jsreport/playground

git clone https://github.com/pofider/kubernetes.git
cd kubernetes
chmod +x push.sh
./push.sh "playground" "jsreport/playground"