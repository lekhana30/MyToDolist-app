(function(){
    Mustache.tags = ["<%", "%>"]
    var data = window.__PRELOADED__
    var sections = data.sections
    var selected = sections[data.selected] || sections[2]

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

        window.scrollTo({top:0, behavior:'smooth'})
        
        // update header sections
        $('#header-selected').html(selected.name)
        $('#header-detail').html(selected.detail)

        if (selected.template!=null){
            $('#main-content').html(selected.template)
            return
        }

        // var templateUrl = '/apps/'+selected.slug+'/template.html'
        // var templateUrl = 'https://cdn.turbo360-dev.com/templates/base-template-tnzakf/dist/apps/'+selected.slug+'/template.html'

        var templateUrl = '/apps/template/'+selected.slug
        // console.log('FETCH TEMPLATE: ' + templateUrl)
        window.utils.fetchTemplate(templateUrl, function(err, data){
            if (err){
                console.log('Fetch Template Error: ' + err)
                return
            }

            selected.template = data
            reloadUI()
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
            reloadUI()
        })
    })

    reloadUI()
})()