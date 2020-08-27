# memson

![npm](https://img.shields.io/npm/v/memson) ![npm](https://img.shields.io/npm/dt/memson) ![GitHub](https://img.shields.io/github/license/memson/memson-node)

NodeJS client of the memson API

Installing
---
```bash
$ npm install --save memson
```

Examples
---

### Importing

```js
const memson = require("memson");
```
or
```js
const { memson } = require("memson");
```

### Set up
```js
const s = require("memson");

const memson = s.memson("demo.memson.co");
```
or
```js
const { memson } = require("memson");

const memson = memson("demo.memson.co");
```

### Database summary

```js
memson.summary()
.then(response => console.log(response))
.catch(error => console.error(error));
```

### Create a table

```js
memson.create({
    "name": "orders",
    "columns": [
       {"name": "time", "type": "time"},
       {"name": "qty", "type": "int"},
       {"name": "price", "type": "float"}
    ],
    "recreate": true
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

### Insert data

```js
memson.insert({
    "name": "orders", 
    "rows": [
        {"time": "00:00:00", "qty": 2, "price": 9.0},
        {"time": "00:30:09", "qty": 2, "price": 2.0},
        {"time": "01:45:01", "qty": 4, "price": 1.0},
        {"time": "12:10:33", "qty": 10, "price": 16.0},
        {"time": "16:00:09", "qty": 4, "price": 8.0},
        {"time": "22:00:00", "qty": 4, "price": 23.0},
        {"time": "22:31:49", "qty": 4, "price": 45.0},
        {"time": "22:59:19", "qty": 4, "price": 17.0},
    ]
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

### Query data
*Check out in [RunKit](https://runkit.com/memson/5d7c162cea9933001c32a424)*

#### Select from table

```js
memson.query({
    "select": ["time", "qty", "price"],
    "from": "orders"
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

#### Visualize data

```js
memson.query({
    "select": ["time", "qty", "price"],
    "from": "orders"
})
.then(response => {
    response.visualize()
})
.catch(error => console.error(error));
```

#### Query table statistics

```js
memson.query({
    select: [
        { max: "time" },
        { min: "time" },
        { min: "qty" },
        { max: "qty" },
        { min: "price" },
        { max: "price" }
    ],
    from: "orders"
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

#### Slice the data into hour buckets

```js
memson.query({
    select: { count: "price" },
    by: { bar: ["time", { time: [1, 0, 0] }] },
    from: "orders"
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

#### Slice and group the quantity by bars of 2

```js
memson.query({
    select: { count: "price" },
    by: { bar: ["qty", 2] },
   "from": "orders"
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

### Delete tables

```js
memson.delete("orders")
.then(response => console.log(response))
.catch(error => console.error(error));
```

Docs
---

https://memson.github.io/memson-node/

License
---

memson is copyright (c) 2019-present memson, Inc.

memson is free software, licensed under the MIT. See the LICENSE file for more details.