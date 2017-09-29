//pull up full view of blog post//
$(document).ready(function(){
  $('.readMore').click(function(){
    var blog = $(this).attr('id');
    console.log("onclick button called");
    document.location = '/fullpost/' + blog;
  });
});

//Pull up blog post for editing//
$(document).ready(function(){
  $('.edit').click(function(){
    var edit = $(this).attr('id');
    console.log("edit button called");
    document.location = '/edit/' + edit;
  });
});

$(document).ready(function(){
  $('.delete').click(function(){
    var del = $(this).attr('id');
    console.log("delete button called");
    $.ajax({
      type:"DELETE",
      url: '/fullpost/' + del,
      error: function(xhr,ajaxOptions, thrownError){
        console.log(thrownError);
      },
      success: function(data){
        console.log("reload activated");
        document.location = '/';
      }
    });
  });
});
