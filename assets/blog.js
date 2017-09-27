//pull up full view of blog post//
$(document).ready(function(){
  $('.readMore').click(function(){
    var blog = $(this).attr('id');
    console.log("onclick button called");
    document.location = '/fullPost/' + blog;
  });
});

//Pull up blog post for editing//
$(document).ready(function(){
  $('.edit').click(function(){
    var edit = $(this).attr('id');
    console.log("edit button called");
    //document.location = '/edit/' + edit;
  });
});
