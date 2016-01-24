var wikiapi = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&callback=?&gsrsearch=';
var wikilink = 'http://en.wikipedia.org/?curid=';


$(document).ready(function() {
  $('#searchText').focus();

  $('#search').on('click', function(e) {
    var text = $('#searchText').val()
    getData(text);
  })

  $('#searchText').keyup(function(e) {

    var empty = false;
    $('#searchText').each(function() {
      if ($(this).val() == '') {
        empty = true;
      }
    });

    if (empty) {
      $('#search').attr('disabled', 'disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
    } else {
      $('#search').removeAttr('disabled'); // updated according to http://stackoverflow.com/questions/7637790/how-to-remove-disabled-attribute-with-jquery-ie
      var key = e.which;
      if (key == 13) // the enter key code
      {
        $('#search').click();
        return false;
      }
    }
  });
})

function getData(text) {
  var query = wikiapi + text;

  var ret = '';

  $.getJSON(query, function(result) {
    $.each(result.query.pages, function(i, field) {
      console.log(field);
      console.log('=-=-=-=-')
      ret += buildResult(field);
    });

    scrollToAnchor('#searchText');
    $('#return').fadeOut('fast', function() {
      $('#return').html(ret);
      $('#return').fadeIn();
    })
  });
}

function scrollToAnchor(aid) {
  var aTag = $(aid);
  $('html,body').animate({
    scrollTop: aTag.offset().top - 75
  }, 'slow');
}

function buildResult(result) {
  console.log(result)
  var thumbnail = '';
  if (result.thumbnail) {
    thumbnail = result.thumbnail.source
  } else {
    thumbnail = 'images/tinyicon.png'
  }

  // Mixing JS with HTML? Oh, the humanity! :p
  var html = '';
  html += '<div class="row">'
  html += '<div class="innerRow">'
  html += '<img class="img-responsive img-rounded pull-left gap-right" src="' + thumbnail + '"/>'
  html += '<h4 class="title">'
  html += '<a target="_blank" href="' + wikilink + result.pageid + '">'
  html += result.title
  html += '</a>'
  html += '</h4>'
  html += '<span class="desc">' + result.extract + '</span>'
  html += '</div>' //second col
  html += '</div>' //row
  return html
}