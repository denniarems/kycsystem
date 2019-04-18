
const { Message, EventFilter, EventList,FilterType,EventSubscription, ClientEventsSubscribeRequest, ClientEventsSubscribeResponse
  } = require('sawtooth-sdk/protobuf');
const { Stream } = require('sawtooth-sdk/messaging/stream');
const { TextDecoder , TextEncoder } = require('text-encoding/lib/encoding')

const Url = "tcp://validator:4004" ;
let myStream = new Stream(Url) ;

// returns the subscription request status 
function checkStatus(response){
        let msg = ""
        if (response.status === 0){
                msg = 'subscription : OK'
        } else if (response.status === 1){
                msg = 'subscription : GOOD '
        } else {
                msg = 'subscription failed !'
        }
        return msg
}


function getEventsMessage(message){
        // Write your event handling code here
        console.log("EVENTS....................")
        let eventlist =EventList.decode(message.content).events 
        eventlist.map((event)=>{
                if(event.eventType == 'Kyc Chain/PoliceReject'){
                        console.log("POLICE REJECT EVENT OCCURS ",event) ;
                }
                else if(event.eventType == 'Kyc Chain/Policeverified'){
                        console.log(" VERIFIED EVENT OCCURS ",event)
                }
                else if(event.eventType == 'Kyc Chain/Passwordchanged'){
                        console.log(" Password Change EVENT OCCURS ",event)
                }
        })
}


function EventSubscribe(Url){
        console.log("SUBSC !!!!!!!!!!!!!!!!!!!!!!!!!")

        const verifiedSubs = EventSubscription.create({
                eventType : 'Kyc Chain/Policeverified' 
        })
        const passwordSubs = EventSubscription.create({
                eventType : 'Kyc Chain/Passwordchanged' 
        })

        const rejectionSubs = EventSubscription.create({
                eventType :'Kyc Chain/PoliceReject'
        })
        const subsc_request = ClientEventsSubscribeRequest.encode({
                subscriptions : [  passwordSubs,verifiedSubs,rejectionSubs]
        }).finish()
        
        myStream.connect(()=>{
                console.log("CONNECTIING TO VALIDATOR ");
                myStream.send(Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST,subsc_request)
                .then((response)=>{
                        return ClientEventsSubscribeResponse.decode(response) ;
                }).then((decoded_resp)=>{
                        console.log(checkStatus(decoded_resp))
                })
                myStream.onReceive(getEventsMessage)
        
        })
}

EventSubscribe(Url);