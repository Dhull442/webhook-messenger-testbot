'use script';
const PAGE_ACCESS_TOKEN = process.env.EAAKY4YZCFttMBAEKkAQ5sOZBZA9DjDXN6rliMczi7FwDHRJMaI2K5iElBZBuwag0KUDZBXmZCepwSxm2f6YYmP9QEUGQDIRCKsoApsUqHDt2u3T7BXctvsnDPWzK8A19lPrTugTry4ZA9scFJZA1aZC8iI3Q8XKQDfwViheKYV9955OlBzYppM43D;
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json());

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.post('/webhook',(req,res)=>{
    let body = req.body;

    if(body.object==='page'){
        body.entry.forEach(function(entry)
        {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('sender PSID: '+sender_psid);
            if(webhook_event.message)
            {
                handleMessage(sender_psid,webhook_event.message);
            }
            else if(webhook_event.postback){
                handlePostback(sender_psid,webhook_event.postback);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    }
    else
    {
        res.sendStatus(404);
    }
});

app.get('/webhook',(req,res)=> {
    let VERIFY_TOKEN = "devops"
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if(mode && token)
    {
        if(mode === 'subscribe' && token === VERIFY_TOKEN){
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        }
        else{
            res.sendStatus(403);
            console.log('VERIFICATION FAILED');

        }
    }
});

function handleMessage(sender_psid, received_message){
    let response;

    if(received_message.text){
        response = {
            "text": `You sent the message: "${received_message.text}"`
        }
    }
    else if(received_message.attachments){
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment":{
                "type": "template",
                "payload":{
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [{
                            "type": "postback",
                            "title": "Yes!",
                            "payload": "yes",
                        },
                        {
                            "type": "postback",
                            "title": "NO!",
                            "payload": "no",
                        }
                        ],
                    }]
                }
            }
        }
    }
    callSendAPI(sender_psid,response);
}
function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}