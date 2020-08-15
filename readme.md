Source code of NewsApp's backend, as part of homework 8 and homework 9 for CSCI 571 Web Technologies in USC during 2020 Spring semester.

## Technology
Built with Node.js and Express framework.

## Endpoints
Get 15 news from Guardian or NYTimes:
* /Guardian/Home  
* /NYTimes/Home  

Get 15 news from Guardian or NYTimes based on 5 sections  
* /Guardian/World
* /Guardian/Politics
* /Guardian/Business
* /Guardian/Technology
* /Guardian/Sports
* /NYTimes/World
* /NYTimes/Politics
* /NYTimes/Business
* /NYTimes/Technology
* /NYTimes/Sports

Get one news article in detail  
* /article/Guardian/:id
* /article/NYTimes/:id

Search news given keyword  
* /search/Guardian/:keyword
* /search/NYTimes/:keyword

## Endpoints for iOS app
Get 10 news from Guardian
* /ios/home

Get 10 news based on section
* /ios/world
* /ios/business
* /ios/politics
* /ios/sports
* /ios/technology
* /ios/science


