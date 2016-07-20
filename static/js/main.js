var photos;
var TRANSITION_TIME = 6000;
var TOTAL_PHOTOS = 1; //MUST correspond with number of #insta divs. ie #insta1 #insta2
var INSTAGRAM_DATA;
var transition_index = 0;
//var next_url = 'https://api.instagram.com/v1/users/231289739/media/recent?callback=?&count=100';
var next_url = 'https://api.instagram.com/v1/tags/ewsperformance/media/recent?callback=?&count=100';

$(document).ready(function() {
     instagramSlideshow();
     setupSubscribeBox();
});

function setupSubscribeBox() {
     $("#dialog-button").click(function () {
        $("#mc_embed_popup").dialog({
               resizable: false, modal: true, width: 320, height: 150,
               title: $("#subscribe-title-text").val()
          });  
     });
}

function instagramSlideshow() {
     $("#insta-side img").live('click', function() {
          window.open($(this).attr('link'));
          return false;
     });
     
     var tag = 'opera';
     var count = 10000;
     //http://stackoverflow.com/questions/16496511/how-to-get-an-instagram-access-token
     var access_token = '231289739.756dab7.05cde9fe68e94679b37f1d46b28e544e';
     var access_parameters = {access_token:access_token};
     var userid = '231289739'; //This is the User ID for @ericschlossberg
     grabImages(access_parameters, tag, count, userid);
}

function grabImages(access_parameters, tag, count, userid) {
     $.getJSON(next_url, access_parameters, onDataLoaded);
}

function onDataLoaded(instagram_data) {
     var initialRun = false;
     if (INSTAGRAM_DATA == undefined) {
          initialRun = true;
     }
     $('#insta0 img:hidden').remove();
     
     INSTAGRAM_DATA = instagram_data;
     
     if(instagram_data.meta.code == 200) {
          next_url = instagram_data.pagination.next_url;
          // create a variable that holds all returned payload
          photos = shuffle(instagram_data.data);
      
          //as long as that variable holds data (does not = ) then...
          if(photos.length > 0) {
            //since there are multiple objects in the payload we have
            //to create a loop
            var i = 0;
            for (var key in photos ){
              //we create a variable for one object
              var photo = photos[key];
              //if (photo.caption != null) { alert(photo.caption.text); }
              //then we create and append to the DOM an  element in jQuery
              //the source of which is the thumbnail of the photo
              //if (photo.caption != null && photo.caption.text.indexOf('#performance') !== -1) {
              if (photo.caption != null && photo.caption.from.username == 'ericschlossberg') {
               var newPhoto = $("<img/>", {
                  link: photo.link,
                  src: photo.images.thumbnail.url,
                  height: 101,
                  width: 101
               });
               newPhoto.hide();
               //var newPhoto = '<img css="display:none;" link="' +photo.link+ '" height=101 width=101 src="' +photo.images.thumbnail.url+ '" />';
               $("#insta0").append(newPhoto);
               setTimeout("transitionPhoto(" +key+ ");", i*TRANSITION_TIME);
               i++;
              }
            }
               setTimeout("onDataLoaded(INSTAGRAM_DATA);", i*TRANSITION_TIME); //Loop it .... but it's buggy- causes freezing occasionally
          }
          else {
            //if the photos variable doesnt hold data
          }
     } else  {
          //if we didn't get a 200 (success) request code from instagram
     }
}

function transitionPhoto(key) {
     $('#insta0 img:visible').fadeOut(TRANSITION_TIME);
     $('#insta0 img:not(.used)').eq(0).fadeIn(TRANSITION_TIME).addClass('used');
     transition_index++;
}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter--) | 0;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

/*//Twitter
window.onload = function() {
     var ajax_load = "<img class='loader' src='ajax-loader.gif' alt='Loading...' />";
     var url = 'https://api.twitter.com/1/statuses/user_timeline.json?screen_name=ericschlossberg&include_rts=true&callback=twitterCallback2&count=4';
     var script = document.createElement('script');    
     $("#twitter_feed").html(ajax_load);
     script.setAttribute('src', url);
     document.body.appendChild(script);
}
function twitterCallback2(twitters) {
  var statusHTML = [];
  for (var i=0; i<twitters.length; i++){
    var username = twitters[i].user.screen_name;
    var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, 
     function(url) { return '<a href="'+url+'">'+url+'</a>';
    }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
      return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
    });
    statusHTML.push('<li class="twitter_date"><a href="http://twitter.com/'+username+'/statuses/'+twitters[i].id_str+'">'+relative_time(twitters[i].created_at)+'</a></li> <li><p>'+status+'</p></li>');
  }
  document.getElementById('twitter_update_list').innerHTML = statusHTML.join('');
}
function relative_time(time_value) {
  var values = time_value.split(" ");
  time_value = values[1] + " " + values[2] + " " + values[5] + " " + values[3];
  var parsed_date = new Date();
  parsed_date.setTime(Date.parse(time_value));  
  var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
     'Sep', 'Oct', 'Nov', 'Dec');
  var m = parsed_date.getMonth();
  var postedAt = '';
  postedAt = months[m];
  postedAt += " "+ parsed_date.getDate();
  postedAt += ","
  postedAt += " "+ parsed_date.getFullYear();
  return postedAt;
}*/