<h1 align="center">
  <br>
  <img align="center" alt="Skill-Sync" height="125px" src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/Logo.png" /> 
  <br>
  Skill-Sync
    <h4 align="center">An Innovative learning Platform  Built On Top Of <a href="https://nodejs.org/en/" target="_blank">NodeJS</a> That Makes Skill Acquisition An Enjoyable Journey.</h4>
</h1>

<br>

# Table of Contents
<img align="right" alt="GIF" height="125px" src="https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif" /> 
- <a href="#key-features">Key Features</a><br>
- <a href="#digrams">Diagrams </a><br>
- <a href="#built-with">Used Packages</a><br>
- <a href="#cicd-pipeline">CI/CD Pipeline</a><br>
- <a href="#team-members">Team Members</a>

---



| Components            | 
| -------                         |
| <img src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/Components.png" width="1000" />   | 


## Key Features
| Features                          | Description                                                                                                 |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| Authentication and  Authorization System   | This feature provides users with login and logout functionality to access the system.                  |
| Managing & Scheduling Live Sessions      | |
| Real-Time Matching System        | |
| Payment system         | |
| Optimized Feed        | |


## Digrams
Here are several diagrams that we employed to document and elucidate some of our fundamental features.

Login sequence           |  Session Making Sequence
:-------------------------:|:-------------------------:
<img width="500px"  src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/login.png" />  | <img width="500px" src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/sessions.png" /> 

Onboarding Sequence           |  Chatting Sequence
:-------------------------:|:-------------------------:
<img width="500px" src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/onboarding.png"  />  |  <img width="500px" src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/chatting.png" />
  
Database ERD       |  System Architecture 
:-------------------------:|:-------------------------:
<img width="500px"  src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/Skill-Sync%20(ERD).png" />  |<img width="500px" src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/system%20arch.png"  />
  


<!-- 
<div>
  ## API Usage and Documentation
Before using the API, you need to set the variables in Postman depending on your environment (development or production). Simply add:
```
- {{URL}} with your hostname as value (Eg. http://127.0.0.1:3000 or http://www.example.com)
- {{password}} with your user password as value.
```
For more info check API Documentation on Postman 👉 : [Natours API Documentation](https://documenter.getpostman.com/view/8689170/SVmzvwpY?version=latest).

- Some API End-Points: 
  - 👉 [Tours List](https://natours-pw5m.onrender.com/api/v1/tours)
  - 👉 [Tours State](https://natours-pw5m.onrender.com/api/v1/tours/tour-stats)
  - 👉 [Get Top 5 Cheap Tours](https://natours-pw5m.onrender.com/api/v1/tours/top_5_rated)
  - 👉 [Get Tours Within Radius](https://natours-pw5m.onrender.com/api/v1/tours/tours-within/200/center/34.098453,-118.096327/unit/mi)
  - 👉 [Get Tours Plans In Each Month](https://natours-pw5m.onrender.com/api/v1/tours/monthly-plan/2021)

| General Package                  | Description                                      |
|--------------------------|--------------------------------------------------|
| express                  | Web framework for building APIs.                  |
| mongoose                 | MongoDB object modeling tool.                    |
| dotenv                   | Loads environment variables from a .env file.     |
| cookie-parser            | Middleware for parsing cookies.                   |
| body-parser              | Middleware for parsing JSON and URL-encoded data. |
| morgan                   | HTTP request logger middleware.                  |
| validator                | Library for data validation and sanitization.     |
| socket.io                | Real-time, bidirectional communication library.   |
| nodemon                  | Utility to automatically restart Node.js applications. |
| pm2                      | Process manager for Node.js applications.         |
| cryptjs                  | Library for hashing and salting passwords.        |
| crypto                   | Node.js library for cryptographic functions.     |

| Development Package                  | Description                                      |
|--------------------------|--------------------------------------------------|
| prettier                 | Code formatter to enforce code style.            |
| eslint                   | JavaScript linting utility for code quality.     |
| jest                     | JavaScript testing framework.                    |
| supertest                | HTTP assertion library for testing APIs.         |


| Security Package                  | Description                                      |
|--------------------------|--------------------------------------------------|
| cors                     | Middleware for handling Cross-Origin Resource Sharing (CORS). |
| express-rate-limit       | Middleware for rate-limiting requests.            |
| express-mongo-sanitize   | Middleware to prevent MongoDB query injection.    |
| helmet                   | Middleware for securing HTTP headers.             |
| hpp                      | Middleware for preventing HTTP Parameter Pollution. |
| jsonwebtoken             | Library for generating and verifying JSON Web Tokens (JWT). |
| xss-clean                | Middleware for preventing cross-site scripting (XSS) attacks. |


</div>
-->

---

## Built With
Skill-Sync will be built using the following Technologies and packages:
### Technologies Used

- [Node.js](https://nodejs.org/en/): for server-side programming.
- [Express](http://expressjs.com/): for building the backend API.
- [MongoDB](https://www.mongodb.com/): for storing users-generated data.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - for remotely deploy MongoDB database
- [redis](https://redis.io/):  in-memory data store for users in matching process
- [Cloudinary](https://cloudinary.com/): for image hosting and management.
- [Firebase](https://firebase.google.com/) - for pushing notification
- [Postman](https://www.getpostman.com/) - for API testing


### Packages Used
| General Packages            | 
| -------                         |
| <img src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/General%20Packages.png" width="1000" />   | 

Security Packages          |  Development Packages
:-------------------------:|:-------------------------:
<img width="500px"  src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/Security%20Packages.png" />  |<img width="500px" src="https://github.com/Skill-Sync/SkillSync-Backend/blob/master/.github/res/imgs/Development%20Packages.png"  /> <br> we utilize [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for formatting and style.















## CI/CD Pipeline
-
  
## Team-Members
#### BackEnd Team consists of:
- [@Mohammed Medhat    ](https://github.com/MOHAMMED1MEDHAT)     
- [@Mohamed Abo El-Seoud ](https://github.com/MAES-Pyramids) 



<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=60&section=footer"  width="100%"/>
</p>
