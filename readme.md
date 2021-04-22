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
       
