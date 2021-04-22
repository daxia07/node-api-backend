# REST API Server
## Create indexes in DB
1. unique indexes
    ```javascript
    db.posts.createIndex({"url": 1}, { unique: true, name: "uniqueUrl", background: true })
    ```
2. sort index 
    ```javascript
    db.posts.createIndex({likes: 1, views: -1, visitedDate: 1, post_date: -1, topic: 1 })
    ```
       
## Useful queries
```javascript
db.posts.update({_id:ObjectId("6080f6e44d25686bbc48d6c2")}, 
    {$inc:{views:1}})
```