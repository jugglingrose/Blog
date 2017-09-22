
/* click button to pull up a full page blog post*/
$(document).ready(function(){
  $('.readMore').click(function(){
    var blog = $(this).attr('id');
    console.log("onclick button called");
    $.ajax({
      type:"GET",
      url: '/fullPost/' + blog,
      error: function(xhr, ajaxOptions, thrownError){
        console.log(thrownError);
      },
      success: function(data){
        console.log("reload activated");
        location.reload(true);
      }

    });
  });
});
