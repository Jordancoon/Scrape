function toggleFavorite(elem) {
    // Empty object for passing data to server
    var article = {};
    // Set favorite value to opposite current value
    article.favorite = !($(elem).data("favorite"));
    console.log("Article favorite: " + article.favorite);
    // Grab article id from data-article-id attribute
    article.id = $(elem).data("article-id");
    console.log("Article id: " + article.id);
  
    $.post("/articles/favorites", article)
    .then(function (data) {
      // Toggle heart icon using latest db info
      if (data.favorite == true) {
        $(elem).addClass("fa-heart");
        $(elem).removeClass("fa-heart-o");
        $(elem).data("favorite", true);
      } else if (data.favorite == false) {
        $(elem).addClass("fa-heart-o");
        $(elem).removeClass("fa-heart");
        $(elem).data("favorite", false);
      }
    });
  }
  
  $(document).ready(function(){
  
    $(document).on("click", "button.delete", function (e) {
      console.log("scrape button clicked!");
      $.get("/articles/remove")
      .then(function () {
        // $("ul.articleList").empty();
        $("ul.articleList")
        .html("<p>All articles have been removed from the database. Scrape to get new ones.</p>");
      });
    });
  
    $(document).on("click", "button.scrape", function (e) {
      console.log("scrape button clicked!");
      $.get("/scrape")
      .then(function (data) {
        // if(data.articleCount!=0) {
        console.log(data);
          console.log("# of articles scraped: " + data.insertCount);
        //   window.location.replace("/"+data.articleCount);
        // } else {
          window.location.replace("/");
        // }
      });
    });
  
    $(document).on("click", ".favorite", function (e) {
      toggleFavorite(this);
    });
  
    $(document).on("click", ".note", function (e) {
      $(this).siblings(".noteField").slideToggle(300);
    });
  
    $(".noteForm").submit(function (e) {
      console.log("Note submitted.");
      e.preventDefault();
      // Set up empty object for db insertion
      var note = {};
      var that = $(this);
      note.body = $(this).find(".noteText").val();
      note.articleID = $(this).data("article-id");
      console.log("note.body: "+note.body);
      console.log("note.articleID: "+note.articleID);
  
      $.post("/notes/", note)
      .then(function (data) {
        console.log("Note saved!");
        console.log(data);
        $(that).find(".saved").animate({
            opacity: "1",
            top: "-=.6rem"
        }, 300, function () {
          $(that).find(".saved").delay(1500).fadeOut();
        });
      });
    });
  
  });