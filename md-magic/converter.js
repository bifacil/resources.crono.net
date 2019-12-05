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
