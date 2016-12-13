$(function(){


    var src1;
    var src2;
    var src3;
    var src4;
    var counter = 0;
    var channel;

    var video_out  = document.getElementById("video-stream");
    var here_now   = document.getElementById('here-now');
    var stream_info= document.getElementById('stream-info');
    var end_stream = document.getElementById('end-stream');

    var streamName;


    $('button#launch').click(function(){
        channel = Math.floor(Math.random() * 99999 + 1);
        $(this).hide(300);
        $('div.dv-launch').append('<span class="spn-loading glyphicon glyphicon-refresh glyphicon-refresh-animate" style="font-size:48px"></span>')
        $('div#loading-page').show(300);
        $('div#header-content-broadcaster h1').html('READY TO JOIN?');

        setTimeout(function() {

            errWrap(stream,$(this));
            src1 = './images/cat1.jpg';
            src2 = './images/cat2.jpg';
            src3 = './images/cat3.jpg';
            src4 = './images/cat4.jpg';
            var images = new Array(src1, src2, src3, src4);
            $('div#slides-content').html('<img src="' + images[counter] + '" class="images-slides">');
            $('div#responses').html('<div class="row">'+

                '<div class="answer-content col-sm-6">'+
                '<div class="answer-broadcaster answer-1 text-center">'+
                '<h3>Answer 1</h3></div></div>'+

                '<div class="answer-content col-sm-6">'+
                '<div class="answer-broadcaster answer-2 text-center">'+
                '<h3>Answer 2</h3></div></div>'+

                '<div class="answer-content col-sm-6">'+
                '<div class="answer-broadcaster answer-3 text-center">'+
                '<h3>Answer 3</h3></div></div>'+

                '<div class="answer-content col-sm-6">'+
                '<div class="answer-broadcaster answer-4 text-center">'+
                '<h3>Answer 4</h3></div></div>'+

            '</div>');

            $('.dv-launch').hide(300);
            $('div#loading-page').hide(300);

            $('div#first-page').show(300);
            $('div#header-content-broadcaster h1').html(''+channel+'<p>is your code pin</p>');




        },2000);

    });


    $('button#start-now').click(function(){

        $('body').removeClass('multiColor');
        $('div.jumbotron').removeClass('header-content');
        $('div.dvStream').hide();
        $('div#first-page').css({"position": "absolute", "z-index": "0"});
        $('#video-stream').addClass('dvCircle');
        $('#video-stream video').addClass('vid-small');

        $('div#header-content-broadcaster').html('<p>Q1 What is this? </p>');

        $('div.dv-next').show(200);
        $('div.slides-content').show(200);

        var numQuestion = counter+1;

        var data ={event:'startEvent', totalQuestions : 24 , numQuestion : numQuestion, countAnswersSlide : 4};
        phone.pubnub.publish({
            channel :  channel+'-stream',
            message :  data,
            callback : function(m){
                console.log(m)
            }
        });
    });

    $('#end-stream').click(function(){
        end();
    });


    function stream() {
        streamName = channel+'';
        var phone = window.phone = PHONE({
            number        : streamName, // listen on username line else random
            publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key
            subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
            oneway        : true,
            broadcast     : true,
        });

        var ctrl = window.ctrl = CONTROLLER(phone, get_xirsys_servers);
        ctrl.ready(function(){
            ctrl.addLocalStream(video_out);
            ctrl.stream();
            stream_info.hidden=false;
            end_stream.hidden =false;
            console.log("Streaming to " + streamName);
        });
        ctrl.receive(function(session){
            session.connected(function(session){ console.log(session.number + " has joined."); });
            session.ended(function(session) { console.log(session.number + " has left."); console.log(session)});
        });
        ctrl.streamPresence(function(m){
            here_now.innerHTML=m.occupancy;
            console.log(m.occupancy + " currently watching.");
            $('span.player-here-now').text(m.occupancy+'')
        });
        ctrl.streamReceive(function(m){
            console.log(m);
            switch(m.event){
                case 'studentConnect':
                $('#start-now').removeAttr('disabled');
                break;
            }
        });
        return false;
    }

    function getVideo(number){
        return $('*[data-number="'+number+'"]');
    }

    function addLog(log){
        $('#logs').append("<p>"+log+"</p>");
    }

    function end(){
        if (!window.phone) return;
        ctrl.hangup();
        video_out.innerHTML = "";
    }

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