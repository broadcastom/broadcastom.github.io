$(function(){


    var video_out  = document.getElementById("video-stream");
    var here_now   = document.getElementById('here-now');
    var stream_info= document.getElementById('stream-info');
    var code;

    $('select#select-role').on('change', function (e) {
        var valueSelected = this.value;
        if(valueSelected === 'student'){
            $('input#name-student').removeAttr('disabled');
        }else{
            $('input#name-student').attr('disabled','disabled');
            $('input#name-student').val('');
        }
    });

    $('button#joint-stream').click(function(){
        var valueSelected = $('select#select-role').val();
        var codeChannel = $('#code-channel').val();
        var nameStudent = $('#name-student').val();

        code = codeChannel;

        if(valueSelected == 'student' && !nameStudent){
            return;
        }
/*------------------------------------------------------ANIMATOR-----------------------------------------------------------------------------*/
        if(valueSelected == 'animator'){

            $('div.card-container').remove();
            $('body').removeClass('multiColor').addClass('backgroundGreen');
            $('div#dvContentVideo').html('<h1 style="color:#f5f5f5">loading!!</h1>' +
                '<span class="spn-loading glyphicon glyphicon-refresh glyphicon-refresh-animate" style="font-size:100px"></span>');
            return errWrap(watch,$(this));

        }


/*------------------------------------------------------STUDENT-----------------------------------------------------------------------------*/
        if(valueSelected == 'student'){

            var pubnub = PUBNUB.init({
                publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key
                subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
                uuid : nameStudent,
                error: function (error) {
                    console.log('Error:', error);
                }
            });

            pubnub.subscribe({
                channel : code+'-stream',
                /*----------------------------------------------message pubnub------------------------------------------*/
                message : function(m){
                    console.log(m);
                    switch(m.event){
                        case 'startEvent':

                            $('body').removeClass('backgroundGreen');
                            $('div#loading-student').remove();
                            var answers = parseInt(m.countAnswersSlide);

                            $('div#header-content-viewer').html('<h1>Question N'+ m.numQuestion+' </h1><p>'+nameStudent+'</p>');
                            $('div#header-content-viewer').removeClass('hidden');
                            for(var i=1; i<= answers; i++){
                                $('div#responses-student').append(
                                    '<div class="answer-content col-sm-6">'+
                                    '<div class="answer-students answer-'+i+' text-center">'+
                                    '<h3>Answer '+i+'</h3></div></div>'
                                );
                            }

                            /*$.each(answers, function(index,value){
                                var numAnswer = index+1;
                                $('div#responses-student').html('<div class="row">'+

                                    '<div class="answer-content col-sm-6">'+
                                    '<div class="answer-brodcaster answer-'+numAnswer+' text-center">'+
                                    '<h3>Answer '+numAnswer+'</h3></div></div>'+

                                    '</div>');
                            });*/

                            break;
                    }
                },
                /*----------------------------------------------End message pubnub--------------------------------------*/
                connect : function(){
                    
                    var data ={event:'studentConnect', name : nameStudent};
                    pubnub.publish({
                        channel :  code+'-stream',        
                        message :  data,
                        callback : function(m){
                            //console.log(m)
                        }
                    });
                    $('div.card-container').remove();
                    $('body').removeClass('multiColor').addClass('backgroundGreen');
                    $('div#loading-student').html('<h1 style="color:#f5f5f5">Hello '+nameStudent +' Waits for quiz start!!</h1>' +
                    '<span class="spn-loading glyphicon glyphicon-refresh glyphicon-refresh-animate" style="font-size:100px"></span>');
                },

                presence : function(m){
                    console.log(m);
                },
                
                error : function (error) {
                    alert(JSON.stringify(error));
                }
            });
        }

    });




    function watch(){
        var num = code;
        var phone = window.phone = PHONE({
            number        : "Viewer" + Math.floor(Math.random()*100), // listen on username line else random
            publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key
            subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
            oneway        : true
        });
        var ctrl = window.ctrl = CONTROLLER(phone, get_xirsys_servers);
        ctrl.ready(function(){
            ctrl.isStreaming(num, function(isOn){
                if (isOn) ctrl.joinStream(num);
                else alert("User is not streaming!");
            });
            console.log("Joining stream  " + num);
        });
        ctrl.receive(function(session){
            session.connected(function(session){
                video_out.appendChild(session.video);
                console.log(session.number + " has joined.");
                stream_info.hidden=false;
                $('div#dvContentVideo').remove();
            });
            session.ended(function(session) { console.log(session.number + " has left."); });
        });
        ctrl.streamPresence(function(m){
            here_now.innerHTML=m.occupancy;
            console.log(m.occupancy + " currently watching.");
        });
        return false;
    }



    function addLog(log){
        $('#logs').append("<p>"+log+"</p>");
    }


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Request fresh TURN servers from XirSys - Need to explain.
// room=default&application=default&domain=kevingleason.me&ident=gleasonk&secret=b9066b5e-1f75-11e5-866a-c400956a1e19
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    function get_xirsys_servers() {
        var servers;
        $.ajax({
            type: 'POST',
            url: 'https://service.xirsys.com/ice',
            data: {
                room: 'default',
                application: 'default',
                domain: 'kevingleason.me',
                ident: 'gleasonk',
                secret: 'b9066b5e-1f75-11e5-866a-c400956a1e19',
                secure: 1,
            },
            success: function(res) {
                console.log(res);
                res = JSON.parse(res);
                if (!res.e) servers = res.d.iceServers;
            },
            async: false
        });
        return servers;
    }

    function errWrap(fxn, form){
        try {
            return fxn(form);
        } catch(err) {
            alert("WebRTC is currently only supported by Chrome, Opera, and Firefox");
            return false;
        }
    }
});