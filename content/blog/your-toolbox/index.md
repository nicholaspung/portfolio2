---
title: Your Toolbox | Learnings
date: "2020-04-20T22:40:32.169Z"
description: "I had been using Habitica as my habit tracker for quite some time, but I got sick of the extra pop-ups and gaming aspects of the application as I didn't use those features. When I decided to pursue programming, one of my goals was to build applications that I would use for myself, and re-building a Habitica clone that only had the features I would use was a great start."
template: "blog"
draft: false
---

## Background

I had been using [Habitica](https://habitica.com/) as my habit tracker for quite some time, but I got became tired of the extra pop-ups and gaming aspects of the application as I didn't use those features. When I decided to pursue programming, one of my goals was to build applications that I would use for myself, and re-building a Habitica clone that only had the features I would use was a great start.

## What I Did

I decided to use React and Firebase to create the application because:

- React: I wanted to create the application as soon as possible and I'm most familiar with it
- Firebase: I didn't want to deal with creating my own backend server with authentication and a database.

## Reflections

- Firebase for authentication was one of the easier processes when creating this project.
- Firebase Cloud Firestore was a little more difficult to use because of my focus on having the minimal read/writes to the database while also having to create documents that would have been a lot easier to handle with a relational database.
- React Context API seems to only be useful when you have a specific state for specific fields. If you want to grab a whole bunch of data together to display, there's a lot of prop-drilling that would not be necessary if using something like Redux.

## Learnings

- Refactoring takes a lot of time.
- Build an application with architecture in mind first. Thinking you can change your architecture while building your application will give you a bad time and make you spend a lot more time on the project than you wanted.
- Using Firebase for both authentication and database is easy. Using a NoSQL database for an application meant to use a SQL database makes logic rather difficult. Make sure you are using the right kind of database rather than what technology you want to use.
- Deciding between React Context API and Redux will depend on how big your application is and what you decide to do with it.
