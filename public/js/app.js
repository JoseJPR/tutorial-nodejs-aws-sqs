//Global
var buttonSaveConfiguration, buttonCreateQueue, buttonShowQueues, buttonShowQueuesSelect, buttonSendMessage, buttonReceiveMessage;
document.addEventListener("DOMContentLoaded", function(event) {

  //Show data save into localstorage
  showLocalStorageData();

  //Definition elements
  buttonSaveConfiguration = document.querySelector("#buttonSaveConfiguration");
  buttonCreateQueue = document.querySelector("#buttonCreateQueue");
  buttonShowQueues = document.querySelector("#buttonShowQueues");
  buttonShowQueuesSelect = document.querySelector("#buttonShowQueuesSelect");
  buttonSendMessage = document.querySelector("#sendMessage");
  buttonReceiveMessage = document.querySelector("#receiveMessage");
  
  //Button Save Configurationszxºx
  buttonSaveConfiguration.onclick = function(){
    if(
      document.querySelector('#accessKey').value == '' 
      || 
      document.querySelector('#secretKey').value == ''
      || 
      document.querySelector('#region').value == ''
    ){
       alert('Ups! All fields are required.');
       return;
    }
    //Connection SQS
    connectionSQS({
      accessKey: document.querySelector('#accessKey').value,
      secretKey: document.querySelector('#secretKey').value,
      region: document.querySelector('#region').value
    });
  }

  //Button Create Queue
  buttonCreateQueue.onclick = function(){
    if(!dataRequired()){
      alert('Ups! Configuration data is required.');
      return;
    }
    if(document.querySelector('#queueName').value == ''){
      alert('Ups! Queue Name field is required.');
      return;
    }
    //Create Queue SQS
    createQueue({
      queueName: document.querySelector('#queueName').value
    });
  }

  //Button Show Queues
  buttonShowQueues.onclick = function(){
    if(!dataRequired()){
      alert('Ups! Configuration data is required.');
      return;
    }
    //Load Queues SQS
    loadQueues();
  }

  //Button Show Queues into select element
  buttonShowQueuesSelect.onclick = function(){
    if(!dataRequired()){
      alert('Ups! Configuration data is required.');
      return;
    }
    //Load Queues SQS
    loadQueuesSelect();
  }

  //Button Send Message
  buttonSendMessage.onclick = function(){
    if(!dataRequired()){
      alert('Ups! Configuration data is required.');
      return;
    }
    if(document.querySelector('#messageBody').value == ''){
      alert('Ups! Body Message field is required.');
      return;
    }
    //Create Queue SQS
    sendMessage({
      queueUrl: document.querySelector('#selectQueue').value,
      messageBody: document.querySelector('#messageBody').value,
      messageDelaySeconds: document.querySelector('#messageDelaySeconds').value
    });
  }

  //Button Receive Message
  buttonReceiveMessage.onclick = function(){
    if(!dataRequired()){
      alert('Ups! Configuration data is required.');
      return;
    }
    if(document.querySelector('#selectQueue').value == ''){
      alert('Ups! Queue url field is required.');
      return;
    }
    //Create Queue SQS
    receiveMessage({
      queueUrl: document.querySelector('#selectQueue').value,
    });
  }

});

//Controller required data configuration form
const dataRequired = function(){
  if(localStorage.getItem('accessKey') && localStorage.getItem('secretKey') && localStorage.getItem('region')){
    return true;
  }else{
    return false;
  }
}

//Show init localstorage data into configuration form
const showLocalStorageData = function(){
  if(localStorage.getItem('accessKey'))
    document.querySelector('#accessKey').value = localStorage.getItem('accessKey');
  if(localStorage.getItem('secretKey'))
    document.querySelector('#secretKey').value = localStorage.getItem('secretKey');
  if(localStorage.getItem('region'))
    document.querySelector('#region').value = localStorage.getItem('region');
}

//Function to connect AWS SQS
const connectionSQS = function(data){
  //Service Connection SQS
  $services.connectionSQS(data).then(function(result){
    console.log('connectionSQS', result);
    if(data.status == 'ko'){
      alert('Ups! Something went wrong, try again.');
      return;
    }
    localStorage.setItem('accessKey', document.querySelector('#accessKey').value);
    localStorage.setItem('secretKey', document.querySelector('#secretKey').value);
    localStorage.setItem('region', document.querySelector('#region').value);
    alert('Yeah! Configuration data saved.');
  }).catch(function(){
    localStorage.clear();
    alert('Ups! Something went wrong, try again.');
  });
}

//Function to call service create queue
const createQueue = function(data){
  //Service Create Queue SQS
  $services.createQueue(data).then(function(){
    //Load again queue list
    buttonShowQueues.click();
  }).catch(function(){
    alert('Ups! Something went wrong, try again.');
  });
}

//Function to call service to load queue
const loadQueues = function(){
  //Show temp text message into list
  document.querySelector('#listQueues').innerHTML = '<tr><th scope="row"></th><td>Loading...</td><td></td></tr>';
  //Service Load Queues SQS
  $services.loadQueues().then(function(data){
    if(data.status == 'ko'){
      alert('Ups! Something went wrong, try again.');
      return;
    }
    if(!data.result.QueueUrls){
      document.querySelector('#listQueues').innerHTML = '<tr><th scope="row"></th><td>You do not have queue created, create your first queue.</td><td></td></tr>';
      return;
    }
    //Load all queue urls and include into list
    let items = '';
    for(let i = 0; i < data.result.QueueUrls.length; i++){
      items += '<tr><th scope="row">' + i + '</th><td>' + data.result.QueueUrls[i] + '</td><td class="text-right"><button onclick="deleteQueue(\'' + data.result.QueueUrls[i] + '\')" class="btn btn-outline-danger btn-sm shadow-sm">Remove</button></td></tr>';
    }
    //Clear list and include news rows
    document.querySelector('#listQueues').innerHTML = '';
    document.querySelector('#listQueues').insertAdjacentHTML("beforeend", items);
  }).catch(function(){
    alert('Ups! Something went wrong, try again.');
  });
}

//Function to call service to delete queue
const deleteQueue = function(queueUrl){
  //Service Delete Queues SQS
  $services.deleteQueue({
    queueUrl: queueUrl
  }).then(function(data){
    if(data.status == 'ko'){
      alert('Ups! Something went wrong, try again.');
      return;
    }
    //Load again queue list
    buttonShowQueues.click();
  }).catch(function(){
    alert('Ups! Something went wrong, try again.');
  });
}

//Function to call service to load queue
const loadQueuesSelect = function(){
  //Show temp text message into list
  document.querySelector('#selectQueue').innerHTML = '<option value="">Loading...</option>';
  //Service Load Queues SQS
  $services.loadQueues().then(function(data){
    if(data.status == 'ko'){
      alert('Ups! Something went wrong, try again.');
      return;
    }
    if(!data.result.QueueUrls){
      document.querySelector('#selectQueue').innerHTML = '<option value="">Select a Queue to manage your messages</option>';
      return;
    }
    //Load all queue urls and include into select
    let items = '';
    for(let i = 0; i < data.result.QueueUrls.length; i++){
      items += '<option value="' + data.result.QueueUrls[i] + '">' + data.result.QueueUrls[i] + '</option>';
    }
    //Clear list and include news options
    document.querySelector('#selectQueue').innerHTML = '<option value="">Select a Queue to manage your messages</option>';
    document.querySelector('#selectQueue').insertAdjacentHTML("beforeend", items);
  }).catch(function(){
    alert('Ups! Something went wrong, try again.');
  });
}

//Send message to queue
const sendMessage = function(data){
  //Service Create Message into Queue SQS
  $services.sendMessage(data).then(function(){
    //Load again message list
    buttonReceiveMessage.click();
  }).catch(function(){
    alert('Ups! Something went wrong, try again.');
  });
}

//Function to call service to load queue
const receiveMessage = function(data){
  //Show temp text message into list
  document.querySelector('#listMessages').innerHTML = '<tr><th scope="row"></th><td>Loading...</td><td></td></tr>';
  //Service Load Message from Queue SQS
  $services.receiveMessage(data).then(function(data){
    if(data.status == 'ko'){
      alert('Ups! Something went wrong, try again. receiveMessage0');
      return;
    }
    if(!data.result.Messages){
      document.querySelector('#listMessages').innerHTML = '<tr><th scope="row"></th><td>You do not have messages created for this queue, create your first message.</td><td></td></tr>';
      return;
    }
    //Load all messages urls and include into list
    var selectQueue = document.querySelector('#selectQueue').value;
    let items = '';
    for(let i = 0; i < data.result.Messages.length; i++){
      items += '<tr><th scope="row">' + i + '</th><td>' + data.result.Messages[i].Body + '</td><td class="text-right"><button onclick="deleteMessage(\'' + selectQueue + '\', \'' + data.result.Messages[i].ReceiptHandle + '\')" class="btn btn-outline-danger btn-sm shadow-sm">Remove</button></td></tr>';
    }
    //Clear list and include news rows
    document.querySelector('#listMessages').innerHTML = '';
    document.querySelector('#listMessages').insertAdjacentHTML("beforeend", items);
  }).catch(function(){
    alert('Ups! Something went wrong, try again. receiveMessage1');
  });
}

//Function to call service to delete message
const deleteMessage = function(queueUrl, receiptHandle){
  //Service Delete Message SQS
  $services.deleteMessage({
    queueUrl: queueUrl,
    receiptHandle: receiptHandle
  }).then(function(data){
    if(data.status == 'ko'){
      alert('Ups! Something went wrong, try again. deleteMessage0');
      return;
    }
    //Load again message list
    buttonReceiveMessage.click();
  }).catch(function(){
    alert('Ups! Something went wrong, try again. deleteMessage1');
  });
}