---
title: Productivity Hub | Case Study
date: "2020-11-01T22:40:32.169Z"
description: "After creating bits and pieces of productivity tools I used in separate applications, I wanted to consolidate them into one big application to understand how to maintain a project that is ongoing in a production environment. So finally, I embarked on creating the application I will maintain throughout my life for personal use."
template: "blog"
draft: false
---

## Background

After completing [Your Toolbox](/blog/your-toolbox/) and [Distraction Free](/blog/distraction-free/), I decided to combine the two tools into one application and to build upon the application to gain experience in updating and maintaining an application in a production environment where there were no risks in failure. As a start, the minimum viable product would be a combination of both a habit tracker and post saver, where the configuration of both apps notify me of where things break. Long term, the project will be a whole suite of tools where users can pick and choose which tool they want to use.

## What I Did

I chose to create the front end using React and Redux because I was most familiar and confident in my ability to churn out features at a fast pace to build my tools. Using TailwindCSS as the base library for my CSS, it also provided me with a way to create designs that were usable and clean. I opted to use Firebase as the authentication server to connect OAuth services because of how simple it is to use compared to Auth0, where the set up was a lot more complicated.

For the back end, I chose to use Django and Django Rest Framework because of the job descriptions I found job hunting in addition to developing in different languages, rather than getting stuck with developing in a single language. I chose not to use Django's built-in authentication because I didn't want the hassle of saving critical information, which is another reason why I opted to use Firebase Authentication.

The database chosen was PostgreSQL because of how flexible the database is. With the project's current configuration, there isn't much complexity with queries so any database could have been chosen.

## Reflections

- Using Django as the backend both complicated things and simplified things.
  - I was spoiled by the fact that Node is asynchronous, so when I tried using Django with APScheduler on uWSGI, I was taken aback. Because of the threading with uWSGI, I wouldn't be able to easily set up background tasks for my server to do, unlike in Node where it was as simple to integrate it. I had to look into adding a task queue, maybe using Celery, but it seemed unnecessary for my current usage of the application. Luckily, I was able to use Cron tasks instead to schedule my background tasks.
  - The first language I used object-oriented programming was with Java, where I couldn't figure out any of the stack traces and had a really hard time debugging. Because of that, I avoided object-oriented programming like the plague. However, challenging myself to use Django in an object-oriented way surprised me and brought me back to object-oriented programming. Because of how easy and reliable the classes were when using Django and Django Rest Framework, I now understand the different strengths that functional programming and object-oriented programming have.
- Python library docs can be mildly frustrating, letting you know that there are arguments and flags but not telling you which arguments or flags to use in documentation.
- Another plus to adding testing to an application. I had to do a minor change in the way a model was structured but had already written integration tests in what I was expecting the endpoints to return. Because of that, I was able to see what needed fixing with ease.

## Learnings

- Making things as modular as possible has its perks in that you know where things have broken. Although there's extra set up time, it helps a lot in the long run.
- It's easy to learn new things when you want to either save time or build something new. For example, I remembered that I could use an AST to detect functions in a file to auto-create its corresponding test. I had previously watched videos on how to use it, but I never thought I would need to code with it. Now I have and realized it's a lot more complicated than I initially thought.
- In working with Python, googling all and everything is your friend.
- For my next Django application, if it's a simple application, deploy using Gunicorn.
