/*$(document).ready(function(){
  $('li.todo-item').click(function(){
    var item = $(this).attr('id');
    console.log("hello");
    $.ajax({
      type:"DELETE",
      url: '/todo_list/' + item,
      error: function(xhr,ajaxOptions, thrownError){
        console.log(thrownError);
      },
      success: function(data){
        console.log("reload activated");
        location.reload(true);
      }

    });
  });
});
*/
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
