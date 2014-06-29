;(function(){
function videoid(string) {
    var id;
    if (match = string.match(/v=([a-zA-z0-9_-]{11})/))
        // youtube url format matches
        id = match[1]
    else if (match = string.match(/^[a-zA-z0-9_-]{11}$/))
        // plain video id format matches
        id = match
    else
        id = null
    return id
}

function pleasetype() {
    $('#search-status i').removeClass('glyphicon-cog glyphicon-refresh glyphicon-forward').addClass('glyphicon-hand-down')
    $('#search-status').removeClass('btn-info btn-success btn-danger')
    $('#search-status span').html('Please type...')
    return
    // Typing hand bounce
    if (typeof(cycle) != 'undefined')
        clearInterval(cycle)
    var bouncer = $('#search-status i')
    cycle = setInterval(function(){
        position = typeof(position) != 'undefined' && position == 'top' ?
            'baseline' : 'top'
        bouncer.css({'vertical-align':position})
    }, 1000)
}

function invalidinput() {
    $('#search-status i').removeClass('glyphicon-cog glyphicon-forward').addClass('glyphicon-hand-down')
    $('#search-status').removeClass('btn-info btn-success btn-danger')
    $('#search-status span').html('Keep tryping...')
}

function notfound() {
    $('#search-status i').removeClass('glyphicon-cog glyphicon-hand-down glyphicon-forward glyphicon-refresh').addClass('glyphicon-remove')
    $('#search-status').removeClass('btn-info btn-success').addClass('btn-danger')
    $('#search-status span').html('Not found')
}

function search(id) {
    $('#search-status i').removeClass('glyphicon-hand-down glyphicon-refresh').addClass('glyphicon-refresh')
    $('#search-status').removeClass('btn-success btn-danger').addClass('btn-info')
    $('#search-status span').html('Checking...')
    var jqxhr = $.ajax('/api/search/'+id)
        .done(function(json, error, xhr) {
            list(json.data)
        })
        .fail(function() {
            notfound()
        })
        .always(function() {
            null
        })
}

function list(data) {
    $('#search-status i').removeClass('glyphicon-refresh').addClass('glyphicon-forward')
    $('#search-status').removeClass('btn-info').addClass('btn-success')
    $('#search-status span').html('Found')
    html = tmpl('tpllist', data)
    $('#search-results').html(html)
}

$(document).ready(function() {
    $('#search-field').on('keyup', function(event) {
        //FIXME: ctrl/alt/meta triggers search() when id
        $('#search-results').html('')
        var input = event.currentTarget.value,
            id = videoid(input)
        if (!input.length)
            pleasetype()
        else if (id)
            search(id)
        else
            invalidinput()
    })
    $('#search-field').focus().trigger('keyup')
})
})();


// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
;(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();
