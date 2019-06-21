
// Grab the articles as a json
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class='card'>"
        + "<div class='card-body'>"
        + "<h5 class='card-title text-center'>"
        + data[i].title
        + "</h5><hr />"
        + "<div class='row'>"
        + "<div class='col-lg-4'>"
        + data[i].link
        + "' target='_blank'><i class='fas fa-external-link-alt'></i></a></button>"
        + "<button type='button' class='btn btn-success' data-id='"
        + data[i]._id
        + "'><i class='far fa-sticky-note'></i></button>"
        + "</div></div></div></div></div>"
      );
    }
  });
  
  $(document).on("click", ".btn-success", function() {
    $("#comments").empty();
    $("#titleinput").val("");
    $("#bodyinput").val("");
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    $('#comments').modal('show');
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    .then(function (data) {
      $("#cheat").text(data._id);
      $(".modal-title").text(data.title);
      if (data.comment) {
          for (var i = 0; i < data.comment.length; i++){
              $("#savedComment").append("<div class='row'>"
                  + "<p class='commentTitle'>"
                  + data.comment[i].title)
                  + "</p>"
              $("#titleinput").val(data.comment.title);
              $("#bodyinput").val(data.comment.body);
          }
      };
  });
  });
  
  // When you click the savenote button
  $(document).on("click", "#saveBtn", function() {
    var thisId = $("#cheat").text();
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#comments").empty();
      });
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  