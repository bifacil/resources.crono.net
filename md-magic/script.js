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


    script.addEventListener('load', () => {

        var markdown = document.querySelector('noscript').innerText
        var converter = new showdown.Converter({
            emoji: true,
            underline: true,
        })
        converter.setFlavor('github')
    
        converter.addExtension(function () {
            return [{
                type: 'output',
                regex: /<a\shref[^>]+>/g,
                replace : function (text) {
                    var url = text.match(/"(.*?)"/)[1]
                    if(url.includes(window.location.hostname) || url[0] == '/' || url[0] == '.' || url[0] == '#'){
                        return text
                    }
                    return '<a href="' + url + '" target="_blank">'
                }
            }]
        }, 'externalLink')
    
    
        var html = "<div id='md'>" + converter.makeHtml(markdown) +'</div>'
        document.body.innerHTML = html
        document.title = document.title || document.body.firstElementChild.innerText.trim()
    
    })

    // Handle hash linking
    setTimeout(function() {
        var hash = window.location.hash
        window.location.hash = ''
        window.location.hash = hash
    }, 100)
})