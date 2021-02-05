(function(){
    window.utils = {
        getRequest: function(endpoint, completion){
            $.ajax({
                url: endpoint,
                type: 'GET',
                data: null,
                success: function(response){
                    // console.log('RESP: ' + JSON.stringify(response))
                    if (response.confirmation != 'success'){
                        completion({message:response.message}, null)
                        return
                    }
                    
                    var payload = response.data || response.result || response.results
                    completion(null, payload)
                    // completion(null, response.data)
                },
                error: function(response){
                    // console.log('ERR: ' + JSON.stringify(response))
                    completion(response, null)
                }
            })
        },

        fetchTemplate: function(url, completion){
            var xhr = new XMLHttpRequest()
            xhr.open('GET', url)
            xhr.setRequestHeader("Content-Type", "text/html")

            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    // console.log('RESPONSE TEXT == ' + xhr.responseText)
                    // console.log('STATUS: '+xhr.status)
                    if (xhr.status>=200 && xhr.status<300){
                        completion(null, xhr.responseText)
                        return
                    }

                    if (xhr.status>=400 && xhr.status<600){
                        completion(new Error(xhr.responseText), null)
                        return
                    }
                }
            }

            xhr.send()
        }
    }
})()