# currencyratetask
Project consists of three main folders (Client, Common, Server).
Client contains all the .html files(currently empty), Common consists of models folder used by both client and server, Server folder has Model to database connector and some other configuration files.

Please do 'npm install' before start testing the project

Other than above mentioned folders, there is an index.js file which is used to submit a new job in beanstalkd pipe, worker.js file is used to exract job from pipe(prashantsiddharth) and it perform required action on the extracted job with the help of file emitkeyshandler.js

To run index.js, use command 'node index.js' and provide valid from and to.
To run worker.js, use command 'node worker.js' and then changes can be seen on console.

If getting currency rate is successful then again after 60s rate will be calcuated from xe.com and will be updated in mongodb server. If it fails then, it will again try to find currency rate after 3s. After 3 failed attempts, job is buried. 

Project has also been deployed to heroku. Api explorer can be seen at http://arcane-wave-87777.herokuapp.com/explorer/ 
GET operation can be done here and also after every 60s currency updation can be seen. 
