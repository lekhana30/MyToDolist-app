(function(){
    // Mustache.tags = ["<%", "%>"]
    var data = window.__PRELOADED__
    var sections = data.sections
    var selected = sections[data.selected]

    var getSectionId = function(id){
        var parts = id.split('-')
        if (parts.length < 2)
            return id
        
        return parts[1]
    }

    var reloadUI = function(){
        if (selected==null)
            return

        $('.sidebar-item').each(function(item){
            var id = $(this).attr('id')
            var sectionId = getSectionId(id)
            if (sectionId == selected.id)
                $(this).addClass('active')
            else 
                $(this).removeClass('active')
        })                
    }

    $('.sidebar-item').each(function(item){
        $(this).click(function(event){
            if (event)
                event.preventDefault()
            
            if (data.isMobile)
                $('#mobile-collapse').click()
            
            var id = $(this).attr('id')
            var sectionId = getSectionId(id)
            if (sectionId===selected.id) // already selected
                return

            selected = sections[sectionId]
            console.log('GO TO SECTION: ' + JSON.stringify(selected))
            window.location.href = '/?selected=' + selected.id
        })
    })

    reloadUI()
})()