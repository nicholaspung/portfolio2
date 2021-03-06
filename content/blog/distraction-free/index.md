---
title: Distraction Free | Case Study
date: "2020-07-14T22:40:32.169Z"
description: "I spent a lot of time distracting myself by looking at Reddit for certain posts. Because of how much time I spend with that on my time, I set out to create an application that would minimize that urge, while also learning new technologies. Although this application would have been extremely easy using React, I decided to use different technologies and make the scope of the project bigger to learn. In doing so, I learned the basics of working with Vue, Auth0, and using a Cron scheduler. "
template: "blog"
draft: false
---

## Background

One day, I found myself thinking about checking Reddit more and more during my time off. It came to the point where I was checking Reddit over 100x a day (I'm exaggerating, but still.) I knew I had to curb that urge somehow, which reminded me of a project I had built in the past, a Reddit Tracker. However, I knew this would be an easy project to do in React, as I had built one after programming for only 2 months. So to challenge myself, I decided to build a separate frontend and backend for the application. I knew I wanted to create an API, even if it was overkill for the scope of the project. On the frontend, I wanted to try a different technology since I learned web development through learning React and also because I heard great things about building with Vue.

## What I Did

I chose to create the project using Vue and Node. For authentication, I didn't want to manage user sensitive information, so I chose Auth0 since I had previously used Firebase Auth. SQLite3 was the primary choice in databases because I knew it didn't require a huge setup on whatever server I decided to host it on.

I chose Vue for the frontend to try out a different way of encapsulation. So by following the tutorial in the Vue documentation and searching up various articles on Vue, I came to an immediate proficiency level for using Vue and VueX, since it was similar to React and Redux.

For the backend, I have previously tried to create an API using Node and Express but was hindered by my lack of knowledge in testing and database knowledge. This time, I spent a huge chunk of time learning what seeding, migrations, and testing looked like for an API that would be used frequently. I took the time to minimize API calls and realized that JOINs wouldn't be that useful for the application I was building.

## Reflections

- Vue and React are very similar in functionality, but one has more control of JavaScript in React than in Vue. However, Vue makes it a lot harder to create a faulty application, so each framework has its advantages and disadvantages.
- Using Auth0 is very, very frustrating to integrate. Although they have documentation on how to start, it stops there. A lot of intricacies with the API need to be discovered either through digging or trial and error. Or maybe I haven't worked with a more fleshed out authentication configuration, which could always be the case.
- Testing is pretty useful in making sure the application runs the way it is intended. I know that when I have a frontend bug, it's likely a frontend bug, rather than a backend bug because I have 80+% code coverage.
  Cron schedulers are very interesting to use.
- Integrating logging and documentation always is pretty easy. I can see that if an API is set up correctly, it's very easy to find where an application is breaking.
- SQLite3 is mildly infuriating when dealing with booleans and date objects from JavaScript.
- This application would have been a lot easier to work with if it was a NoSQL database. I should have switched the databases around between Distraction Free and [Your Toolbox](/blog/your-toolbox/)

## Learnings

- When creating an API, adding good documentation and logging is easy. It just takes time. Just do it.
- Serve your application as soon as you have a minimal viable product. After I started using the application myself, my productivity in finishing the project skyrocketed because of the missing features I wanted.
- Repetition is key to understanding what you are doing. I spent a few hours migrating SQLite3 databases because of misconfigurations, which ultimately made me more comfortable dealing with the database.
- Database design is the most important thing you need to focus on when creating an API. Coding up the logic to go into your database is easy. Rewriting schemas is hard.
