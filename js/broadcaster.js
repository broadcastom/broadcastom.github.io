$(function(){


    var src1 = './images/cat1.jpg';
    var src2 = './images/cat2.jpg';
    var src3 = './images/cat3.jpg';
    var src4 = './images/cat4.jpg';
    var images = new Array(src1, src2, src3, src4);

    var countInterval;
    var IntervalNum = 5;
    var totalQ = 4;

    var counter = 0;
    var channel;

    var video_out  = document.getElementById("video-stream");
    var here_now   = document.getElementById('here-now');
    var stream_info= document.getElementById('stream-info');
    var end_stream = document.getElementById('end-stream');
    var codeSite;
    var codeEvent;
    var streamName;
    var classroom;
    var nickname;


    //var images = [];
    var totalAnswers = 4;
    var correctAnswers = ['1','3','4','2'];
    var arrayUsersAndPoints = [];

    for (var i = 0; i <= 6; i++) {
        arrayUsersAndPoints.push({
            name: 'student'+i,
            point: '1000'+i
        });
    }

    //console.log(getHighest(arrayUsersAndPoints));

    //console.log(arrayUsersAndPoints);

    var titlesQuestions = ["Title question 1","Title question 2","Title question 3","Title question 4"];

    $('button#launch').click(function(){
        channel = Math.floor(Math.random() * 99999 + 1);

        codeSite = $('#code-site').val();
        codeEvent = $('#code-event').val();

        //channel = codeSite+''+codeEvent;

        //$(this).hide(300);
        $('div#form-action').html('<span class="spn-loading glyphicon glyphicon-refresh glyphicon-refresh-animate" style="font-size:48px"></span>');
        $('div#welcome-page').show(300);
        $('div#header-content-broadcaster h1').html('READY TO JOIN?');

        /*var url ='http://localhost/monProjet/wp-json/wp/v2/media?parent='+codeEvent;
         $.getJSON(url, function(result){
             $.each(result, function(i, field){

                 if(field.media_type == 'image'){
                    images[i] = field.source_url;
                 }
             });



         });*/

        /*-------------------------*/
        $('#form-action').hide(300);
        $('div#welcome-page').hide(300);
        $('div#first-page').show(300);
        $('div#header-content-broadcaster').html('<h2 style="color: #f5f5f5">'+channel+'</h2><p style="color: #f5f5f5">is your code pin</p>');
        /*-------------------------*/
        errWrap(stream,$(this));

    });


    /*----------------------------------------------------ANIMATOR JOINT--------------------------------------------------*/
    $('button#joint-stream-animators').click(function() {

        //var codeChannel = $('#code-channel').val();
        streamName = $('#code-channel').val();
        classroom = $('#classroom').val();
        nickname = $('#nickname').val();

        $('.dvStream').html('&nbsp;');
        //$('div#contentVideo').removeClass('col-sm-8').addClass('col-sm-12')
        $('div#form-action').html('<span class="spn-loading glyphicon glyphicon-refresh glyphicon-refresh-animate" style="font-size:48px"></span>');
        $('div#welcome-page').show(300);
        $('div#header-content-broadcaster h1').html('READY TO JOIN?');
        //$('body').removeClass('multiColor').addClass('backgroundGreen');

        errWrap(watch, $(this));




    });



    /*--------------------------------------------------Start Event Quiz---------------------------------------------*/
    $('button#start-now').click(function(){

        var object = 'MY OBJECT';
        var nm = counter+1;
        var data = {
            event: 'firstStart',
            object: object,
            totalQuestion: totalQ
        };
        phone.pubnub.publish({
            channel: channel + '-stream',
            message: data,
            callback: function (m) {
                firstStart(object, totalQ);
            }
        });

        setTimeout(function() {
            var data = {
                event: 'secondStart',
                numQuestion: nm,
                totalQuestion: totalQ,
                titleQuestion: titlesQuestions[counter],


                slideImg : images[counter],
                totalAnswers: totalAnswers,
                correctAnswer : correctAnswers[counter]
            };
            phone.pubnub.publish({
                channel: channel + '-stream',
                message: data,
                callback: function (m) {
                    secondStart(nm,totalQ,titlesQuestions[counter],images[counter],totalAnswers,correctAnswers[counter]);
                }
            });

        },4000);

        setTimeout(function() {


            var data = {
                event: 'thirdStart',
                titleQuestion: titlesQuestions[counter],
                intervalNum : IntervalNum
            };

            phone.pubnub.publish({
                channel: channel + '-stream',
                message: data,
                callback: function (m) {
                    //console.log(m[1]);
                    thirdStart(titlesQuestions[counter]);
                    $('div.dv-next').show(200);

                    $('.countdown').html(''+IntervalNum);
                    countInterval = setInterval(function() {
                        $('.countdown').each(function () {
                            //var count = parseInt($(this).html());
                            var count = IntervalNum;
                            if (count !== 0) {
                                $(this).html(count - 1);
                                IntervalNum--;
                            }else{
                                //alert('finish');
                                clearInterval(countInterval);
                                var data = {
                                    event: 'showCorrectAnswer',
                                    totalAnswers: 4,
                                    correctAnswer : 1
                                };
                                phone.pubnub.publish({
                                    channel: channel + '-stream',
                                    message: data,
                                    callback: function (m) {
                                        generateCharacteristicAnswers(4);
                                    }
                                });
                            }
                        });
                    }, 1000);
                }
            });
        },8000);
    });

    /*--------------------------------------------------Next Event Quiz---------------------------------------------*/
    $('button#next-slide').click(function(){
        $(this).hide(300);
        $('#get-scoreboard').show(300);


        counter++;
        IntervalNum = 5;
        var nm = counter+1;



        var data = {
            event: 'secondStart',
            numQuestion: nm,
            totalQuestion: totalQ,
            titleQuestion: titlesQuestions[counter],

            slideImg : images[counter],
            totalAnswers: totalAnswers,
            correctAnswer : correctAnswers[counter]

        };
        phone.pubnub.publish({
            channel: channel + '-stream',
            message: data,
            callback: function (m) {
                secondStart(nm,totalQ,titlesQuestions[counter],images[counter],totalAnswers,correctAnswers[counter]);
            }
        });


        setTimeout(function() {

            var data = {
                event: 'thirdStart',
                titleQuestion: titlesQuestions[counter],
                intervalNum : IntervalNum
            };

            phone.pubnub.publish({
                channel: channel + '-stream',
                message: data,
                callback: function (m) {

                    thirdStart(titlesQuestions[counter]);


                    $('.countdown').html(''+IntervalNum);
                    countInterval = setInterval(function() {
                        $('.countdown').each(function () {
                            var count = IntervalNum;
                            if (count !== 0) {
                                $(this).html(count - 1);
                                IntervalNum--;
                            }else{
                                clearInterval(countInterval);
                                var data = {
                                    event: 'showCorrectAnswer',
                                    totalAnswers: 4,
                                    correctAnswer : 1
                                };
                                phone.pubnub.publish({
                                    channel: channel + '-stream',
                                    message: data,
                                    callback: function (m) {
                                        generateCharacteristicAnswers(4);
                                    }
                                });
                            }
                        });
                    }, 1000);
                }
            });
        },4000);



        if(counter == images.length -1){
            $(this).attr('disabled','disabled');

        }
    });

    /*--------------------------------------------------Scoreboard Event Quiz---------------------------------------------*/
    $('button#get-scoreboard').click(function() {

        var data = {
            event: 'getScoreboard',
            arrayUsersAndPoints: arrayUsersAndPoints
        };

        phone.pubnub.publish({
            channel: channel + '-stream',
            message: data,
            callback: function (m) {
                $('#get-scoreboard').attr('disabled','disabled');
                $('#get-scoreboard').hide(300);
                //$('#next-slide').show(300);
                $('div#responses').html('');
                $('#slides-content').html('');

                if(counter == images.length -1){
                    $('#next-slide').hide(300);
                    $('#end-quiz').show(300);

                }else{
                    $('#next-slide').show(300);
                }


                $.each(arrayUsersAndPoints,function(index,value){
                    generateScoreboardStudents(value['name'], value['point']);
                });
            }
        });
    });



    /*--------------------------------------------------End Event Quiz---------------------------------------------*/
    $('button#end-quiz').click(function() {

        var winner = getHighest(arrayUsersAndPoints);
        var nameWinner = winner['name'];
        var pointWinner = winner['point'];
        var data = {
            event: 'getWinner',
            nameWinner: nameWinner,
            pointWinner: pointWinner
        };

        phone.pubnub.publish({
            channel: channel + '-stream',
            message: data,
            callback: function (m) {
                $('button#end-quiz').hide(300);
                getWinner(nameWinner,pointWinner);
                $('#dv-feedBack').show(300);
            }
        });
    });


    $('#feedBack').click(function(){

        var data = {
            event: 'feedback',
            title: 'Rate this quiz!'
        };

        phone.pubnub.publish({
            channel: channel + '-stream',
            message: data,
            callback: function (m) {
                $('#feedBack').hide(300);
                rateQuiz('Rate this quiz!')
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
            uuid : streamName,
            oneway        : true,
            broadcast     : true,
        });

        var ctrl = window.ctrl = CONTROLLER(phone, get_xirsys_servers);
        ctrl.ready(function(){
            ctrl.addLocalStream(video_out);
            ctrl.stream();

            /*phone.pubnub.state({
                channel  : streamName+'-stream',
                state    : {
                    "eventId" : codeEvent
                },
                callback : function(m){
                    console.log(m);
                },
                error    : function(m){
                    //console.log(m)
                    alert('ERROR'+m);
                }
            });*/

            stream_info.hidden=false;
            end_stream.hidden =false;
            //console.log("Streaming to " + streamName);
        });
        ctrl.receive(function(session){
            session.connected(function(session){ console.log(session.number + " has joined."); });
            session.ended(function(session) { console.log(session.number + " has left."); console.log(session)});
        });
        ctrl.streamPresence(function(m){
            console.log(m);
            here_now.innerHTML=m.occupancy;
            //console.log(m.occupancy + " currently watching.");
            $('span.player-here-now').text(m.occupancy+'')
        });
        ctrl.streamReceive(function(m){
            //console.log(m);
            switch(m.event){
                case 'jointAnimator':
                    getJoinedClassroom(m.classroom, m.nickname);
                    break;
            }
        });
        return false;
    }

    function watch(){
        var num = streamName;
        var phone = window.phone = PHONE({
            number        : "Viewer" + Math.floor(Math.random()*100), // listen on username line else random
            publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Your Pub Key
            subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Your Sub Key
            uuid          : nickname,
            oneway        : true
        });
        var ctrl = window.ctrl = CONTROLLER(phone, get_xirsys_servers);
        ctrl.ready(function(){
            ctrl.isStreaming(num, function(isOn){
                if (isOn){
                    ctrl.joinStream(num);

                    phone.pubnub.state({
                        channel : num+'-stream',
                        state : {
                            "classroom" : classroom
                        },

                        callback : function(m){
                            //console.log(JSON.stringify(m))
                            var data = {
                                event: 'jointAnimator',
                                classroom: classroom,
                                nickname: nickname
                            };
                            phone.pubnub.publish({
                                channel: num + '-stream',
                                message: data,
                                callback: function (m) {
                                    getJoinedClassroom(classroom,nickname);
                                }
                            });
                        }
                    });

                }
                else{ alert("User is not streaming!");
                    window.location.reload();}
            });
            //console.log("Joining stream  " + num);
            // Get state by uuid.
            /*phone.pubnub.state({
             channel  : num+'-stream',
             uuid     : num,
             callback : function(m){

             var url ='http://localhost/monProjet/wp-json/wp/v2/media?parent='+m.eventId;
             $.getJSON(url, function(result) {

             $.each(result, function (i, field) {

             if (field.media_type == 'image') {
             images[i] = field.source_url;
             }
             });
             });
             },
             error    : function(m){
             alert('ERROR'+m);
             }
             });*/
        });
        ctrl.receive(function(session){
            session.connected(function(session){
                video_out.appendChild(session.video);
                // console.log(session.number + " has joined.");
                stream_info.hidden=false;
                //$('div#dvContentVideo').remove();
                $('#form-action').hide(300);
                $('div#welcome-page').hide(300);
                $('div#header-content-broadcaster').html('<h2 style="color: #f5f5f5">'+streamName+'</h2><p style="color: #f5f5f5">as joined</p>');
                $('div#first-page').show(300);
            });

            session.ended(function(session) { console.log(session.number + " has left."); });
        });
        ctrl.streamPresence(function(m){
            console.log(m);
            here_now.innerHTML=m.occupancy;
            //console.log(m.occupancy + " currently watching.");
        });


        ctrl.streamReceive(function(m){
            //console.log(m);
            switch(m.event){

                case 'firstStart':
                    firstStart(m.object, m.totalQuestion);
                    break;

                case 'secondStart':
                    secondStart(m.numQuestion, m.totalQuestion, m.titleQuestion,m.slideImg,m.totalAnswers, m.correctAnswer);
                    break;

                case 'thirdStart':
                    //console.log(m.intervalNum);
                    thirdStart(m.titleQuestion);
                    IntervalNum = m.intervalNum;
                    $('.countdown').html(''+IntervalNum);
                    countInterval = setInterval(function() {
                        $('.countdown').each(function () {

                            var count = IntervalNum;
                            if (count !== 0) {
                                $(this).html(count - 1);
                                IntervalNum--;
                            }else{
                                clearInterval(countInterval);
                            }
                        });
                    }, 1000);
                    break;

                case 'showCorrectAnswer':
                    generateCharacteristicAnswers(m.totalAnswers);

                    break;

                case 'getScoreboard':
                    $('div#responses').html('');
                    $('#slides-content').html('');
                    $.each(m.arrayUsersAndPoints,function(index,value){
                        generateScoreboardStudents(value['name'], value['point']);
                    });

                    break;

                case 'getWinner':
                    getWinner(m.nameWinner, m.pointWinner);

                    break;

                case 'feedback':
                    rateQuiz(m.title);

                    break;
            }
        });

        return false;
    }

    function firstStart(object,totalQuestions){
        $('body').removeClass('multiColor');
        $('div#slides-content').hide(300);
        $('div.jumbotron').removeClass('header-content');
        $('div.dvStream').hide();
        //$('div#first-page').css({"position": "absolute", "z-index": "0"});
        $('#video-stream').addClass('dvCircle');
        $('#video-stream video').addClass('vid-small');
        $('div#header-content-broadcaster').html('<h1>'+object+' </h1>');
        $('div#slides-title').html('<h2>'+totalQuestions+' questions</h2><h1>Are you ready</h1>');
    }

    function secondStart(numQuestion,totalQuestions,titleQuestion,slideImg,totalAnswers,correctAnsw){


        $('div#slides-content').hide();
        $('body').removeClass('multiColor').addClass('backgroundBlue');
        $('div#form-action').show(300);
        $('div#slides-content').html('<img src="' + slideImg + '" class="images-slides">');
        $('div#header-content-broadcaster').html('<h2>Question '+numQuestion+'</h2><h3> '+titleQuestion+' </h3>');
        $('div#slides-title').html('<h1>Question '+numQuestion+' of '+totalQuestions+'</h1><h3>For up to 1000 points</h3>');

        $('div.dvStream').hide();
        $('#video-stream').addClass('dvCircle');
        $('div.jumbotron').removeClass('header-content');
        $('#video-stream video').addClass('vid-small');


        $('div#responses').html('');
        for(var i=1;i<=totalAnswers;i++){
            if(i == correctAnsw) {
                $('div#responses').append('<div class="col-sm-6">' +
                    '<div class="answer-broadcaster answer-' + i + ' text-center">' +
                    '<h3 style="color: #ffffff">Answer ' + i + '<span id="correct-answer" style="font-size: 30px;display: none" class="glyphicon glyphicon-check pull-right"></span></h3></div></div>');
            }else{
                $('div#responses').append('<div class="watchOpacity col-sm-6">' +
                    '<div class="answer-broadcaster answer-' + i + ' text-center">' +
                    '<h3 style="color: #ffffff">Answer ' + i + '</h3></div></div>');
            }
        }
    }

    function thirdStart(titleQuestion){
        $('div#slides-title').html('');
        $('div#form-action').hide(300);
        $('body').removeClass('backgroundBlue');
        $('div#header-content-broadcaster').html('<p>'+titleQuestion+'</p>');
        $('div#slides-content').show(300);

        $('div#responses').show(300);

        //$('div.dv-next').show(200);
        $('div.dvCount').show(200);
        /*$('div.countdown').show(200);
         $('div.countAnswer').show(200);*/
    }

    function generateCharacteristicAnswers(totalAnswers){
        $('#scoreboard-content').html('');

        $('div.watchOpacity').css('opacity','0.2');
        $('span#correct-answer').show(300);

        setTimeout(function(){
            $('#slides-content').hide(100);
            for(var i=1;i<=totalAnswers;i++){
                $('div#scoreboard-content').append('<div class="col-sm-3 text-center answer-'+i+
                    '" style="color: #ffffff ;border: 2px solid #ffffff">'+i+'</div>');
            }
            $('#scoreboard-content').show(300);
            $('#get-scoreboard').removeAttr('disabled');
        },2000);

    }


    function generateScoreboardStudents(name,points){
        $('#slides-content').show();
        $('div#scoreboard-content').hide(200);
        $('div.dvCount').hide(200);
        $('div#responses').hide();

        $('div#slides-content').append('<div style="background-color: #eee;margin: 5px;height:50px" class="col-sm-12">' +
            '<span class="nameStudent pull-left">'+name+'</span>' +
            '<span class="nameStudent pull-right">'+points+'</span></div>')

    }


    function getJoinedClassroom(classrom,animator){
        $('div#dv-classroom-with-students').append('<div class="col-sm-4">'+
            '<ul class="list-group list-classroom-students">'+
            '<li class="list-group-item active"><h3>'+classrom+' <span class="badge">12</span></h3></li>'+
            '<li class="list-group-item list-group-item-info"><h4>'+animator+' <span class="badge">prof</span></h4></li>'+
            '</ul> </div>');
    }


    function getWinner(name,point){
        $('div#header-content-broadcaster').html('<h1>And the winner is... </h1>');
        $('div#slides-content').html('<h1 style="background-color: lightblue;">'+name+'</h1><h3>with '+point+ ' points</h3>');
    }


    function rateQuiz(title){
        $('div#header-content-broadcaster').html('<h1>And the winner is... </h1>');
        $('div#slides-content').hide(300);
        $('div#slides-content').html('');
        $('#rate-quiz').show(300);
    }





    function getHighest(array) {
        var max = {};
        for (var i = 0; i < array.length; i++) {
            if (array[i].point > (max.point || 0))
                max = array[i];
        }
        return max;
    }


    /*----------------------------------------------------------------------------------------------------------------------*/
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
        /*$.ajax({
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
         return servers;*/
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
