$(document).ready(function(){

    var playItem = 0;

    var myPlayList = [
        {name:"Alright, you're done", mp3:"https://samitic.us/samboard/audio/Alright, you're done.mp3"},
        {name:"Ah!", mp3:"https://samitic.us/samboard/audio/Ah!.mp3"},
        {name:"Could you guys not look at my crotch", mp3:"https://samitic.us/samboard/audio/Could you guys not look at my crotch.mp3"},
        {name:"Dude, that is not cool", mp3:"https://samitic.us/samboard/audio/Dude, that is not cool.mp3"},
        {name:"Dude, that's not cool, alright", mp3:"https://samitic.us/samboard/audio/Dude, that's not cool, alright.mp3"},
        {name:"Fist yeah", mp3:"https://samitic.us/samboard/audio/Fist yeah.mp3"},
        {name:"Fuck!", mp3:"https://samitic.us/samboard/audio/Fuck!.mp3"},
        {name:"Get the fuck out man", mp3:"https://samitic.us/samboard/audio/Get the fuck out man.mp3"},
        {name:"Get the hell out of here", mp3:"https://samitic.us/samboard/audio/Get the hell out of here.mp3"},
        {name:"Goodnight", mp3:"https://samitic.us/samboard/audio/Goodnight.mp3"},
        {name:"Grab those suckers", mp3:"https://samitic.us/samboard/audio/Grab those suckers.mp3"},
        {name:"He would tell us to fist things", mp3:"https://samitic.us/samboard/audio/He would tell us to fist things.mp3"},
        {name:"Holy crap", mp3:"https://samitic.us/samboard/audio/Holy crap.mp3"},
        {name:"If she has an ugly face, it's no deal", mp3:"https://samitic.us/samboard/audio/If she has an ugly face, it's no deal.mp3"},
        {name:"I look at people's facebook and whack off to it", mp3:"https://samitic.us/samboard/audio/I look at people's facebook and whack off to it.mp3"},
        {name:"I mean, I was just having a conversation with my friends", mp3:"https://samitic.us/samboard/audio/I mean, I was just having a conversation with my friends.mp3"},
        {name:"I was not", mp3:"https://samitic.us/samboard/audio/I was not.mp3"},
        {name:"I'm going to show you guys my penis", mp3:"https://samitic.us/samboard/audio/I'm going to show you guys my penis.mp3"},
        {name:"I'm not sure how to respond to this", mp3:"https://samitic.us/samboard/audio/I'm not sure how to respond to this.mp3"},
        {name:"It was an unfortunate accident", mp3:"https://samitic.us/samboard/audio/It was an unfortunate accident.mp3"},
        {name:"Like sharks in the water", mp3:"https://samitic.us/samboard/audio/Like sharks in the water.mp3"},
        {name:"No high velocities", mp3:"https://samitic.us/samboard/audio/No high velocity.mp3"},
        {name:"No, I'm not", mp3:"https://samitic.us/samboard/audio/No, I'm not.mp3"},
        {name:"No, that's not true", mp3:"https://samitic.us/samboard/audio/No, that's not true.mp3"},
        {name:"Oh shit I can't get up", mp3:"https://samitic.us/samboard/audio/Oh shit I can't get up.mp3"},
        {name:"Oliver touches me", mp3:"https://samitic.us/samboard/audio/Oliver touches me.mp3"},
        {name:"Oliver's kind of obsessed with me", mp3:"https://samitic.us/samboard/audio/Oliver's kind of obsessed with me.mp3"},
        {name:"Shit cock!", mp3:"https://samitic.us/samboard/audio/Shit cock!.mp3"},
        {name:"This is very awkward", mp3:"https://samitic.us/samboard/audio/This is very awkward.mp3"},
        {name:"What are you, a drone?", mp3:"https://samitic.us/samboard/audio/What are you, a drone.mp3"},
        {name:"What the hell you mother fucker", mp3:"https://samitic.us/samboard/audio/What the hell you mother fucker.mp3"},
        {name:"What the hell", mp3:"https://samitic.us/samboard/audio/What the hell.mp3"},
        {name:"You don't have aggro right now", mp3:"https://samitic.us/samboard/audio/You don't have aggro right now.mp3"},
        {name:"Your husband was trying to get me to dangle my balls in your face", mp3:"https://samitic.us/samboard/audio/Your husband was trying to get me to dangle...mp3"},
    ];

    // Local copy of jQuery selectors, for performance.
    var jpPlayTime = $("#jplayer_play_time");
    var jpTotalTime = $("#jplayer_total_time");

    //var autoPlayClip = getURLParam('ap');

    $("#jquery_jplayer").jPlayer({
        ready: function() {
            displayPlayList();
            playListInit(false); // Parameter is a boolean for autoplay.
        },
        oggSupport: false,
        swfPath: "/samboard/js",
        volume: 100
    })
    .jPlayer("onProgressChange", function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
        jpPlayTime.text($.jPlayer.convertTime(playedTime));
        jpTotalTime.text($.jPlayer.convertTime(totalTime));
    })
    .jPlayer("onSoundComplete", function() {
        //playListNext();
    });

    $("#jplayer_previous").click( function() {
        playListPrev();
        $(this).blur();
        return false;
    });

    $("#jplayer_next").click( function() {
        playListNext();
        $(this).blur();
        return false;
    });

    function displayPlayList() {
        $("#jplayer_playlist ul").empty();
        for (i=0; i < myPlayList.length; i++) {
            var listItem = (i == myPlayList.length-1) ? "<li class='jplayer_playlist_item_last'>" : "<li>";
            listItem += "<a href='#' id='jplayer_playlist_item_"+i+"' tabindex='1'>"+ myPlayList[i].name +"</a></li>";
            //listItem += " - <a href='https://samitic.us/samboard-the-sam-ni-soundboard/?ap=" + escape(myPlayList[i].name) + "'>link</a></li>";
            $("#jplayer_playlist ul").append(listItem);
            $("#jplayer_playlist_item_"+i).data( "index", i ).click( function() {
                var index = $(this).data("index");
                if (playItem != index) {
                    playListChange( index );
                } else {
                    $("#jquery_jplayer").jPlayer("play");
                }
                $(this).blur();
                return false;
            });
        }
    }

    function playListInit(autoplay) {
        if(autoplay) {
            playListChange( playItem );
        } else {
            playListConfig( playItem );
        }
    }

    function playListConfig( index ) {
        $("#jplayer_playlist_item_"+playItem).removeClass("jplayer_playlist_current").parent().removeClass("jplayer_playlist_current");
        $("#jplayer_playlist_item_"+index).addClass("jplayer_playlist_current").parent().addClass("jplayer_playlist_current");
        playItem = index;
        $("#jquery_jplayer").jPlayer("setFile", myPlayList[playItem].mp3);
    }

    function playListChange( index ) {
        playListConfig( index );
        $("#jquery_jplayer").jPlayer("play");
    }

    function playListNext() {
        var index = (playItem+1 < myPlayList.length) ? playItem+1 : 0;
        playListChange( index );
    }

    function playListPrev() {
        var index = (playItem-1 >= 0) ? playItem-1 : myPlayList.length-1;
        playListChange( index );
    }
    /*
    function getURLParam( name ) {
        if (!name) return null;
        var match = (new RegExp('[?&]' + name + '=([^&#]+)')).exec(window.location.search);
        return match ? decodeURIComponent(match[1]) : null;
    }

    if ( autoPlayClip ) {
        for (i=0; i < myPlayList.length; i++) {
            if ( myPlayList[i].name == autoPlayClip ) {
                console.log('play', i);
                playListChange(i);
                break;
            }
        }
    }*/

});