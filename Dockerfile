FROM node:16-alpine

# Token Of Your Discord Bot
# [Required]
ENV DISCORD_TOKEN="${DISCORD_TOKEN}"

# API URL for Commands 
# This is actually private API.
# Example
# API_URL=https://api.tamako.tech
ENV API_URL="${API_URL}"

# URI Of Your MongoDB
# [Required]
ENV MONGODB_URI="${MONGODB_URI}"

# Optional Keys
ENV FACEPLUSPLUS_KEY= 
ENV FACEPLUSPLUS_SECRET=
ENV GOOGLE_KEY=
ENV APOD_KEY=
ENV WEBSTER_KEY=
ENV FLICKR_KEY=
ENV GIPHY_KEY=
ENV GITHUB_ACCESS_TOKEN=

RUN apk add  --no-cache git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
CMD ["node", "."]
