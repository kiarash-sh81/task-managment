/**
 * @swagger
 *  tags:
 *    - Auth
 *    - task-controller
 */
/**
 * @swagger
 *  /register:
 *    post:
 *      tags: [Auth] 
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            description: user register
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  required: true
 *                  description: email of the user
 *                password:
 *                  type: string
 *                  required: true
 *                  description: the password of the user
 *                image:
 *                  type: file
 *                  description: user profile
 *      responses:
 *        200:
 *          description: successfull  
 */
/**
 * @swagger
 *  /login:
 *    post:
 *      tags: [Auth] 
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            description: user register
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  required: true
 *                  description: email of the user
 *                password:
 *                  type: string
 *                  required: true
 *                  description: the password of the user
 *      responses:
 *        200:
 *          description: successfull  
 */
/**
 * @swagger
 *  /task:
 *    post:
 *      tags: [task-controller] 
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            description: user add task
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - priority
 *                - image
 *              properties:
 *                name:
 *                  type: string
 *                  required: true
 *                  description: name of task
 *                priority:
 *                  type: string
 *                  required: true
 *                  description: the priorities of task [high , medium , low]
 *                image:
 *                  type: file
 *                  description: task image
 *      responses:
 *        200:
 *          description: successfull  
 */

/**
 * @swagger
 *  /task/{taskID}:
 *    patch:
 *      tags: [task-controller]
 *      parameters:
 *        - in: path
 *          name: taskID
 *          type: string
 *          required: true 
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            description: user add task
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: name of task
 *                priority:
 *                  type: string
 *                  description: the priorities of task [high , medium , low]
 *                image:
 *                  type: file
 *                  description: task image
 *      responses:
 *        200:
 *          description: successfull  
 */

/**
 * @swagger
 *  /task:
 *    get:
 *      tags: [task-controller]
 *      summery: geting user tasks
 *      responses:
 *        200:
 *          description: successfull  
 */
/**
 * @swagger
 *  /task/{taskID}:
 *    get:
 *      tags: [task-controller]
 *      summery: geting task by id
 *      parameters:
 *              -   in: path
 *                  name: taskID
 *                  type: string
 *                  required: true
 *      responses:
 *        200:
 *          description: successfull  
 */
/**
 * @swagger
 *  /task/{taskID}:
 *    delete:
 *      tags: [task-controller]
 *      summery: deleting task by id
 *      parameters:
 *              -   in: path
 *                  name: taskID
 *                  type: string
 *                  required: true
 *      responses:
 *        200:
 *          description: successfull  
 */
