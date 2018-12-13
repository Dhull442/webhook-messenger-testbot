'use script';
const PAGE_ACCESS_TOKEN = "EAAKY4YZCFttMBACuOZBg0u7LM1QZCM6QhHug1aPAU7lzop04xfaIN0LgSbVZCK1lXLCNmLKQVy1is80xUk5IMlVcA8jou1WGGQtMfsM5DSWfZBUZA6lfpO5NU6XJa8VRb1ukAtQIc9zHTZBaNE4CLYZChluTGqnWgrtc6zjLPcxZCVHlDmz1iexUS";
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
        }
        );
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
        }
    }
});

function handleMessage(sender_psid, received_message){}
function handlePostback(sender_psid,received_message){}
function callSendAPI(sender_psid,received_message){}