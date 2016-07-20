
// ?ewstext=Anchor%20element%20text%20goes%20here
function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]) "([^"]*)"/ig;
    return text.replace(exp,'<a target="_blank" href="$1">$3</a>'); 
}

function calendarDiv(dict, key) {
     if (key in dict) {
          var text = dict[key];
          var div = $('<div></div>', {text: text});
          div.addClass('calendar-'+ key.toLowerCase());
          return div;
     }
     return undefined
}

function finishCalendarSetup(response) {
     //console.log(JSON.stringify(response.items));
     var calendar = $(".calendar");
     if (calendar.size() <= 0) {
         finishCalendarSetup(response);
     } else {
          for (var e in response.items) {
            var event = response.items[e];
            var div = $('<div></div>', {id: event['id']});
            div.addClass('calendar-event');
     
            var start = event['start'];
            var startdiv = $('<div></div>');
            if ('dateTime' in start) {
                 starttime = new moment(start['dateTime']);
                 //starttime = starttime.add('minutes', starttime.zone());
                 var startformat = starttime.format('dddd*MMM Do, YYYY*h:mma');
                 startformat += ' ' + start['abbr']
            } else {
                 starttime = new moment(start['date']);
                 var startformat = starttime.format('dddd*MMM Do, YYYY');
            }
            startformat = startformat.replace(/\*/g, '<br/>');
            startdiv.append(startformat);
            startdiv.addClass('calendar-start');
            div.append(startdiv);
            
            var summary = calendarDiv(event, 'summary');
            if (summary != undefined) div.append(summary);
     
            var location = calendarDiv(event, 'location');
            if (location != undefined) {
                 var city = location.text().replace(/   .*/g, '');
                 location = location.text(location.text().replace(/.*   /g, ''));
                 
                 if (city != location.text()) {
                    var cityDiv = $("<div></div>", {
                       text: city
                    });
                    cityDiv.addClass('calendar-city');
                    div.append(cityDiv);
                    var locationname = location.text() + " " + city;
                 } else {
                    var locationname = location.text();
                 }
                 
                 locationname = locationname.replace(/ /g, '+');
                 var map = $('<a></a>', { href: 'http://maps.google.com/maps?q=' +locationname,
                                          target: '_blank',
                                          text: 'map'
                                     });
                 location.append(" ").append(map);
                 
                 div.append(location);
            }
            
            var description = calendarDiv(event, 'description');
     
            var moreinfo = $('<a></a>', { text: 'more info',
                                          href: event['htmlLink'],
                                          target: '_blank'
                             });
            moreinfo.addClass('calendar-moreinfo');
            if (description != undefined) {
                 var descriptionText = replaceURLWithHTMLLinks(description.text());
                 var descriptionText_old = descriptionText;
                 descriptionText = descriptionText.replace(">more info<", ' class="calendar-moreinfo">more info<');
                 description.html(descriptionText);
                 if (descriptionText == descriptionText_old) {
                    description.append(' ').append(moreinfo);
                 }
                 div.append(description);
            }
            else {
                 div.append(moreinfo);
            }
            
            if (starttime > moment().subtract('days', 1)) {
                 calendar.filter('.upcomingevents').append(div);
            } else {
                 calendar.filter('.pastevents').prepend(div);
            }
          }
     }
     if ($('.calendar.upcomingevents .calendar-event').length > 0) {
          $("#upcomingevents-title").show();
     }
}

function calendarSetup() {
    $.ajax({
      type: 'GET',
      url: '/getEvents',
      success: function(response) {
          finishCalendarSetup(response);
      },
      /*error: function(jqXHR, textStatus, errorThrown) {
          console.log('calendar setup error');
          console.log(textStatus);
          console.log(errorThrown);
      },*/
      dataType: "json"
    });
    return false;
}
$(document).ready(function() {
     calendarSetup(); //Right away. no waiting for page to load.
});
