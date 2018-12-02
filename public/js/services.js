$services = {

  connectionSQS: function(data){
    return new Promise(function(resolve, reject){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const result = JSON.parse(this.responseText);
            if(result.status == "ko"){
              reject(result);
            }
            resolve(result);
        }
      };
      xhttp.open("POST", "http://localhost:3000/connection", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
    });
  },
  createQueue: function(data){
    return new Promise(function(resolve, reject){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const result = JSON.parse(this.responseText);
          if(result.status == "ko"){
            reject(result);
          }
          resolve(result);
        }
      };
      xhttp.open("POST", "http://localhost:3000/queue/create", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
    });
  },
  deleteQueue: function(data){
    return new Promise(function(resolve, reject){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const result = JSON.parse(this.responseText);
          if(result.status == "ko"){
            reject(result);
          }
          resolve(result);
        }
      };
      xhttp.open("POST", "http://localhost:3000/queue/delete", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
    });
  },
  loadQueues: function(data){
    return new Promise(function(resolve, reject){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const result = JSON.parse(this.responseText);
          if(result.status == "ko"){
            reject(result);
          }
          resolve(result);
        }
      };
      xhttp.open("GET", "http://localhost:3000/queue/list", true);
      xhttp.send();
    });
  },
  sendMessage: function(data){
    return new Promise(function(resolve, reject){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const result = JSON.parse(this.responseText);
          if(result.status == "ko"){
            reject(result);
          }
          resolve(result);
        }
      };
      xhttp.open("POST", "http://localhost:3000/message/send", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
    });
  },
  receiveMessage: function(data){
    return new Promise(function(resolve, reject){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const result = JSON.parse(this.responseText);
          if(result.status == "ko"){
            reject(result);
          }
          resolve(result);
        }
      };
      xhttp.open("POST", "http://localhost:3000/message/receive", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
    });
  },
  deleteMessage: function(data){
    console.log('deleteMessage', data);
    return new Promise(function(resolve, reject){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        console.log('deleteMessage status', this.status);
        if (this.readyState == 4 && this.status == 200) {
          const result = JSON.parse(this.responseText);
          console.log('deleteMessage', result);
          if(result.status == "ko"){
            console.log('if');
            reject(result);
          }
          console.log('no if');
          resolve(result);
        }
      };
      xhttp.open("POST", "http://localhost:3000/message/delete", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(data));
    });
  },

}