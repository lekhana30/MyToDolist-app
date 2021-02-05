(function(){
  var currentScript = document.currentScript

  // hide promo for now:
  // var vtxPromo = document.getElementById('vertex-promo')
  // if (vtxPromo != null)
  //   vtxPromo.innerHTML = '<iframe style="width:100%;border:none;min-height:350px" src="https://cdn.turbo360-vertex.com/vertex360-cms-4hujkc/public/medium/html/promo.html"></iframe>'

  var vtxSubscriber = document.getElementById('vertex-subscribe')
  if (vtxSubscriber == null){
    var innerHTML = '<div id="standard-root"></div>'
    document.body.innerHTML = document.body.innerHTML + innerHTML
  }
  else {
    var innerHTML = '<div id="widget-root"></div>'
    innerHTML += '<small>Stay Up To Date</small><br />'
    innerHTML += '<input id="vertex-input-newsletter" style="border:1px solid #ededed;background:#f9f9f9;padding:6px;margin-right:12px" type="text" placeholder="Email Address" />'
    innerHTML += '<button id="vertex-button-subscribe" style="background:#45a23a;padding:7px 24px;border:none;color:#fff;border-radius:3px">Subscribe</button>'
    vtxSubscriber.innerHTML = innerHTML

    // connect subscriber form:
    setTimeout(function(){
      document.getElementById('vertex-button-subscribe').onclick = function(){
        var emailAddr = document.getElementById('vertex-input-newsletter').value
        if (emailAddr.length == 0){
          alert('Please Enter Your Email')
          return
        }

        var data = window.__PRELOADED__
        if (data == null)
          return

        var site = data.site
        if (site == null)
          return

        var xhr = new XMLHttpRequest()
        // xhr.open('POST', 'https://www.vertex360.co/account/subscriber')
        xhr.open('POST', 'https://www.vertex360.co/api/subscriber')
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

        xhr.onreadystatechange = function() {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            try {
              var data = JSON.parse(xhr.responseText)
              // console.log('DATA == ' + JSON.stringify(data))
              if (data.confirmation != 'success'){
                throw new Error(data.message)
                return
              }

              alert('Thanks For Subscribing!')
            }
            catch (err){
              console.log('PARSE ERR: ' + err)
              alert('Error - ' + err.message)
            }
          }
        }

        xhr.send(JSON.stringify({email:emailAddr, site:site.id, referrer:window.location.href}))
      }

    }, 500)
  }

  var loadWidget = function(root, site, url, entry){
    var div = document.getElementById(root)
    if (div == null)
      return

    // preloaded script tag:
    var siteScript = document.createElement('script')
    siteScript.innerHTML = "window.__PRELOADED_STATE__ = "+JSON.stringify({
      root: root,
      entry: entry,
      entity: entity,
      url: url,
      api: '/api',
      reducers: {
        app: {
          summary: site
        }
      }
    })

    // load react bundle:
    document.body.appendChild(siteScript)
    var scripts = [
      'https://cdn.turbo360-dev.com/admin/common.js',
      'https://cdn.turbo360-dev.com/admin/widget.js'
    ]

    scripts.forEach(function(script){
      var scriptTag = document.createElement('script')
      scriptTag.setAttribute('src', script)
      document.body.appendChild(scriptTag)
    })
  }

  var bindVertexLib = function(){
    var formatParams = function(params){
      return "?" + Object
        .keys(params)
        .map(function(key){
          return key+"="+encodeURIComponent(params[key])
        })
        .join("&")
    }

    var onreadystatechange = function(){
      if (this.readyState == XMLHttpRequest.DONE) {
        if (this.status>=200 && this.status<300){
          try {
            var data = JSON.parse(this.responseText)
            // console.log('DATA == ' + JSON.stringify(data))
            this.completion(null, data)
          }
          catch (err){
            this.completion(err, null)
          }
        }
        else if (this.status>=500 && this.status<600) {
          // console.log('RESPONSE TEXT: '+this.responseText)
          this.completion(new Error('Something went wrong.'), null)
        }
      }
    }

    var xhrRequestObj = function(url, method, completion, headers){ // headers can be null
      var xhr = new XMLHttpRequest()
      xhr.open(method.toUpperCase().trim(), url)
      if (headers){
        var headerKeys = Object.keys(headers)
        headerKeys.forEach(function(headerKey){
          xhr.setRequestHeader(headerKey, headers[headerKey])
        })
      }
      else {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      }
      xhr.onreadystatechange = onreadystatechange
      xhr.completion = completion
      return xhr
    }

    var vertexLib = {
      postRequest: function(url, params, completion, headers){
        var xhr = xhrRequestObj(url, 'POST', completion)
        xhr.send(JSON.stringify(params))
      },

      getRequest: function(url, params, completion, headers){
        url = (params==null) ? url : url+formatParams(params)
        var xhr = xhrRequestObj(url, 'GET', completion)
        xhr.send()
      }
    }

    window.vertexLib = vertexLib
  }

  // this defaults to 'true'
  var withVertexLib = currentScript.getAttribute('vertex-lib') || 'true'
  if (withVertexLib === 'true')
    bindVertexLib()

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

  var data = window.__PRELOADED__ || window.__VTX_PRELOADED__
  if (data == null)
    return

  var site = data.site
  if (site == null)
    return

  var entity = data.entity // post, video, episode, etc
  if (entity == null)
    return
  
  setTimeout(function(){
    var widgetRoot = document.getElementById('widget-root')
    if (widgetRoot != null){
      var entryComponent = currentScript.getAttribute('entry') || 'comments'
      loadWidget('widget-root', site, window.location.pathname, entryComponent)
      return
    }

    var standardRoot = document.getElementById('standard-root')
    if (standardRoot != null){
      var entryComponent = currentScript.getAttribute('entry') || 'standard'
      loadWidget('standard-root', site, window.location.pathname, entryComponent)
      return
    }

  }, 600) // slight delay before loading widget

  return

  // This is the old Vertex lib which loaded the editor
  // for the owner of the website
  var getCookie = function(name) {
      var dc = document.cookie;
      var prefix = name + "=";
      var begin = dc.indexOf("; " + prefix);
      if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0)
          return null;
      }
      else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1)
          end = dc.length;
      }

      // because unescape has been deprecated, replaced with decodeURI
      //return unescape(dc.substring(begin + prefix.length, end));
      return decodeURI(dc.substring(begin + prefix.length, end));
  }

  var vtxSession = getCookie('vertex_session') // null if not found

  // disable for now. July 6th, 2019
  return

  // console.log('CHECK VERTEX COOKIE: ' + vtxSession)
  if (vtxSession == null)
    return

  var loadEditor = function(id, site, url){
    var div = document.createElement('div')
    div.id = id
    div.style.zIndex = '1200'
    div.style.position = 'fixed'
    // div.style.height = '100vh'
    div.style.left = '0'
    div.style.top = '0'
    document.body.appendChild(div)

    var siteScript = document.createElement('script')
    siteScript.innerHTML = "window.__PRELOADED_STATE__ = "+JSON.stringify({
      url: url,
      api: '/api',
      reducers: {
        app: {
          site_id: site.id,
      		apiKey: site.api.key,
      		summary: site
        }
      }
    })

    document.body.appendChild(siteScript)

    var scripts = ['https://cdn.turbo360-dev.com/admin/common.js', 'https://cdn.turbo360-dev.com/admin/widget.js']
    scripts.forEach(function(script){
      var scriptTag = document.createElement('script')
      scriptTag.setAttribute('src', script)
      document.body.appendChild(scriptTag)
    })
  }

  var xhr = new XMLHttpRequest()
  xhr.open('POST', 'https://www.vertex360.co/account/currentuser')
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      try {
        var data = JSON.parse(xhr.responseText)
        // console.log('DATA == ' + JSON.stringify(data))
        if (data.confirmation != 'success'){
          throw new Error(data.message)
          return
        }

        var user = data.user
        if (user == null)
          return

        var site = data.site
        if (site == null)
          return

        loadEditor('root', site, window.location.pathname)
      }
      catch (err){
        console.log('PARSE ERR: ' + err)
      }
    }
  }

  var urlParts = window.location.hostname.split('.')
  xhr.send(JSON.stringify({vertex_session:vtxSession, site:urlParts[0]}))
})()
