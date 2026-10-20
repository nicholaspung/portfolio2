---
title: MD Writer | Case Study
date: "2020-05-20T22:40:32.169Z"
description: "Inspired by Derek Sivers, I decided to create a lightweight text editor that rendered markdown while you write that would only rely on your OS. I chose markdown because even if it becomes unsupported, there's little difference between .txt files and .md files. I chose Electron because it would be a different technology I hadn't learned yet, and also because I didn't want to waste extra time learning a different programming language to build a desktop application."
template: "blog"
draft: false
---

## Background

I was inspired by [Derek Sivers](sivers.org) to not be dependent on the cloud or companies when it came down to hosting on the web. From listening to Sivers talk about programming, he mentioned that he loved to save everything in text files on his computers for notes/articles/books. Inspired by this, I decided to create a lightweight text editor that rendered markdown while you write. I chose markdown because even if it becomes unsupported, there's little difference between .txt files and .md files. I chose Electron because it would be a different technology I hadn't learned yet, and also because I didn't want to waste extra time learning a different programming language to build a desktop application.

## What I Did

I started off looking for Electron templates to make my development process easier. After searching for a while, I realized that most templates seem to be carrying a lot of bloatware that I wouldn't be taking advantage of because of how small the features would be. So in the end, I took [electron-quick-start](https://github.com/electron/electron-quick-start) and started there.

In the beginning, I searched for ways to add React to the project since I wanted to finish the project ASAP, but couldn't find a good enough tutorial to follow. Instead, I decided to use regular Javascript to get used to manipulating the DOM manually and to see how different it would be to create a simple application without a framework.

## Reflections

- Code modularization is still important even if you create a very small project. Logic gets mixed up as the complexity of the application grows and when you start mixing up different functionality in the same function.
- Functional programming seems to be important when creating functionality that is reused, but not the way that functional programming is taught. Whenever I found myself reusing some logic, I would modify it to be "idempotent" in a function so that I wouldn't be confused by what the function does. Of course, I use "idempotent" in quotes because some functions modify the DOM, and others send processes to Electron, which are both side-effects.
- Use JSON.parse() and JSON.stringify() to create a .txt based "database." Because these operations are pretty fast in Node, it's easier to transform between the two data types, rather than modifying a .txt file directly and creating unnecessary complex logic to keep track of data.

## Learnings

- Modularize code in the beginning, even if the application is small.
- Try to make your code follow functional programming concepts, with minimal side-effects.
- Use language-specific ways to make your life easier when dealing with unconventional use cases. For example, transform arrays and objects to strings with JSON.parse() and JSON.stringify() when dealing with make-shift databases, just like how you would when using localStorage on the browser.
