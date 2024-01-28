# NestJs Twitter-Clone API

## Description

- The NestJs Twitter-Clone API is a robust clone of twitter, By creating users and these users can create articles
  and these articles we can interact with them by liking and disliking them

- Users can follow each other. When user A follow other user B , All articles from user B are on the feed page of user A
  It provides a RESTful API built with Node.js, Nest.js, and Mysql( TypeOrm ) , offering developers a powerful tool to create, retrieve, update, and delete blog-related data.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Running the app](#running-the-app)
- [Swagger & Postman](#swagger--postman)
- [GitHub Repo](#github-Repo)

## Features

- **RESTful API Endpoints:**

  - Create, retrieve, update, and delete operations for users, articles, tags, profiles, and other related entities.

- **Lazy loading:**

  - Reduces initial load time – Lazy loading a webpage reduces page weight, allowing for a quicker page load time.
  - Lazy loading can help decrease bootstrap time by loading only modules required by the specific serverless function invocation.

- **MySql Integration:**

  - Seamless interaction with Mysql for efficient data storage and retrieval.

- **Authentication and Authorization:**

  - JWT-based authentication to secure the API.
  - User-only operations for specific endpoints to control access.

- **Nest.js Framework:**

  - Utilization of nest.js features for robust route handling.

- **Testing with Postman:**

  - Pre-configured Postman collections for easy API testing.

- **Secure API:**

  - Implementation of security measures to protect against common vulnerabilities.

- **Error Handling:**

  - Robust error handling mechanisms to ensure smooth API operation.

## Prerequisites

Before running the project, ensure you have the following prerequisites installed:

- [NodeJs](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/download)
- [MySql](https://www.mysql.com/) ( replace configs in .env file with your own )
- [NestJs-Cli](https://docs.nestjs.com/cli/overview)

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Swagger & Postman

##### Once the server is running,

- You can review the api endpoints via [ swagger ](http://localhost:3000/swagger).
- Also you can interact with the API using tools like [Postman](https://www.postman.com/) or integrate it into your application.

[![Run in Postman](https://run.pstmn.io/button.svg)]( file in @documentation folder)

## Github Repo

- My [Github Repo](https://github.com/fakhranyy)
