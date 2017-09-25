

$(document).ready(function(){
  $('.readMore').click(function(){
    var blog = $(this).attr('id');
    console.log("onclick button called");
    document.location = '/fullPost/' + blog;
  });
});
