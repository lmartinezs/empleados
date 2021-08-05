$( document ).ready(function() {
    console.log( "ready!" );
      $( "#searchForm button[type=submit]" ).click(function( e ) {         
        var $form = $( "#searchForm" ),
          term = $form.find( "input[name='searchText']" ).val(),
          url = $form.attr( "action" );
        $("#searchForm").attr('action', url+term);
        if(term == ''){
            alert("Ingresar un valir")
            e.preventDefault(); //prevent the default action
        }
      });
    
      $('#selectRegion').on('change', function() {
        $.ajax({
            url: "/region/"+this.value,            
          }).done(function() {
            location.reload();
            //$( this ).addClass( "done" );
          });
        
      });
      
});