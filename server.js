//Global
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);

const aws = require('aws-sdk');
var sqs;

//Active body parses node module
app.use(bodyParser.json());

//Set static folder and root html file
app.use('/static', express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

const loadConfiguration = function (data) {
  return new Promise(function (resolve, reject) {
    fs.access('config.json', (err) => {
      if (err) {
        reject({ "status": "ko", "error": err });
      }
      fs.writeFile('config.json', JSON.stringify({
        "accessKeyId": data.accessKeyId,
        "secretAccessKey": data.secretAccessKey,
        "region": data.region
      }), (err, fd) => {
        if (err) {
          reject({ "status": "ko", "error": err });
        }
        resolve({ "status": "ok", "result": "Config.json file updated." });
      });
    });
  });
}

// Connect to AWS SQS service
app.post('/connection', function (req, res) {
  if (
    req.body.accessKey
    &&
    req.body.secretKey
    &&
    req.body.region
  ) {
    loadConfiguration({
      accessKeyId: req.body.accessKey,
      secretAccessKey: req.body.secretKey,
      region: req.body.region
    }).then(function (result) {
      if(result.status == "ok"){
        aws.config.loadFromPath(__dirname + '/config.json');
        sqs = new aws.SQS();
        res.send({ "status": "ok", "result": "Connection correctly." })
      }else{
        res.send({ "status": "ko", "error": "Can´t save configuration into config.json file." });
      }
    }).catch(function () {
      res.send({ "status": "ko", "error": "Can´t save configuration into config.json file." });
    });
  } else {
    res.send({ "status": "ko", "error": "AWS access, secret and region fields required." });
  }
});

// Creating a queue.
app.post('/queue/create', function (req, res) {
  if (sqs) {
    if (req.body.queueName) {
      sqs.createQueue({
        QueueName: req.body.queueName
      }, function (err, data) {
        if (err) {
          res.send({ "status": "ko", "error": err });
        }
        else {
          res.send({ "status": "ok", "result": data });
        }
      });
    } else {
      res.send({ "status": "ko", "error": "Queue Name is required." });
    }
  } else {
    res.send({ "status": "ko", "error": "AWS connection is required." });
  }
});

// Delete a queue.
app.post('/queue/delete', function (req, res) {
  if (sqs) {
    if (req.body.queueUrl) {
      sqs.deleteQueue({
        QueueUrl: req.body.queueUrl
      }, function (err, data) {
        if (err) {
          res.send({ "status": "ko", "error": err });
        }
        else {
          res.send({ "status": "ok", "result": data });
        }
      });
    } else {
      res.send({ "status": "ko", "error": "Queue Url is required." });
    }
  } else {
    res.send({ "status": "ko", "error": "AWS connection is required." });
  }
});

// Listing our queues.
app.get('/queue/list', function (req, res) {
  if (sqs) {
    sqs.listQueues(function (err, data) {
      if (err) {
        res.send({ "status": "ko", "error": err });
      }
      else {
        res.send({ "status": "ok", "result": data });
      }
    });
  } else {
    res.send({ "status": "ko", "error": "AWS connection is required." });
  }
});

// Purging the entire queue.
app.get('/queue/purge', function (req, res) {
  if (sqs) {
    sqs.purgeQueue({
      QueueUrl: req.body.queueUrl
    }, function (err, data) {
      if (err) {
        res.send({ "status": "ko", "error": err });
      }
      else {
        res.send({ "status": "ok", "result": data });
      }
    });
  } else {
    res.send({ "status": "ko", "error": "AWS connection is required." })
  }
});

// Register new message into queue
app.post('/message/send', function (req, res) {
  if (sqs) {
    sqs.sendMessage({
      MessageBody: req.body.messageBody,
      QueueUrl: req.body.queueUrl,
      DelaySeconds: req.body.messageDelaySeconds
    }, function (err, data) {
      if (err) {
        res.send({ "status": "ko", "error": err });
      }
      else {
        res.send({ "status": "ok", "resut": data });
      }
    });
  } else {
    res.send({ "status": "ko", "error": "AWS connection is required." })
  }
});

// Receiving message from queue
app.post('/message/receive', function (req, res) {
  if (sqs) {
    sqs.receiveMessage({
      QueueUrl: req.body.queueUrl,
      VisibilityTimeout: 600
    }, function (err, data) {
      if (err) {
        res.send({ "status": "ko", "error": err });
      }
      else {
        res.send({ "status": "ok", "result": data });
      }
    });
  } else {
    res.send({ "status": "ko", "error": "AWS connection is required." })
  }
});

// Deleting a message from queue.
app.post('/message/delete', function (req, res) {
  if (sqs) {
    sqs.deleteMessage({
      QueueUrl: req.body.queueUrl,
      ReceiptHandle: req.body.receiptHandle
    }, function (err, data) {
      if (err) {
        res.send({ "status": "ko", "error": err });
      }
      else {
        res.send({ "status": "ok", "result": data });
      }
    });
  } else {
    res.send({ "status": "ko", "error": "AWS connection is required." })
  }
});

//Active http server port 3000
http.listen(3000, function () {
  console.log('listening on *:3000');
});