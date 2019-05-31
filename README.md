[![CircleCI](https://circleci.com/gh/Auspicus/drupal-jsonapi-client/tree/master.svg?style=svg)](https://circleci.com/gh/Auspicus/drupal-jsonapi-client/tree/master)

# Drupal JSON:API Client

This package makes manipulating Drupal entities and resources easier via the JSON:API module which is now in Drupal core (8.7.x).

## Installation
```
npm i --save drupal-jsonapi-client
```

```
yarn add drupal-jsonapi-client
```

## Key features
- **Lightweight** - HTTP library agnostic, zero dependencies
- **Cross platform** - works in node.js and the browser
- **Drupal specific** - abstracts away the nuances of working with Drupal's JSON:API implementation
- **Object oriented** - leverages ES6 classes to neatly package JSON:API objects

It's still in an early stage and contributions are welcome. The general idea is to maintain a base `Entity` class which can be extended to provide more context specific uses ie. `Article extends Entity`.