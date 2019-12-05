   // Esto es una adaptación del código de https://github.com/oscarmorrison/md-page
   
   document.addEventListener("DOMContentLoaded", function() {

    // Styles
    var sheet = document.createElement('style')
    sheet.innerHTML = '#md { max-width: 860px; margin: 0px auto; padding: 30px 30px 100px; }'
    document.head.prepend(sheet)

    // Viewport
    var viewportMeta = document.createElement('meta')
    viewportMeta.setAttribute('name', 'viewport')
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no')
    document.head.appendChild(viewportMeta)

    var meta = document.createElement('meta')
    meta.setAttribute('charset', 'UTF-8')
    document.head.appendChild(meta)

    var link = document.createElement('link')
    link.setAttribute('href', 'https://bifacil.github.io/resources.crono.net/css/github.css')
    link.setAttribute('rel', 'stylesheet')
    document.head.appendChild(link)
    
    var script = document.createElement('script')
    script.setAttribute('src', 'https://bifacil.github.io/resources.crono.net/md-magic/showdown.js')
    document.head.appendChild(script)

    var script2 = document.createElement('script')
    script2.setAttribute('src', 'https://bifacil.github.io/resources.crono.net/md-magic/converter.js')
    document.head.appendChild(script2)

    // Handle hash linking
    setTimeout(function() {
        var hash = window.location.hash
        window.location.hash = ''
        window.location.hash = hash
    }, 100)
})