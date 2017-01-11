$().ready(function() {
  var activeCorp = $(".corp-ball-radio:checked").val();
  var activeMenuOption = "#";
  
  var smoothGoto = function(scrollTop) {
    $('body,html').animate({
    	scrollTop: scrollTop
    }, 
    {
      duration: 500, 
      easing: 'swing' 
    });  
  } 

  var calculateTopElement = function(internalSelector) {
    internalSelector = internalSelector === "#" ? "body" : internalSelector;
    return $(internalSelector).offset().top;
  }

  var closeMobileMenu = function() {
    $("#navbar-check").prop("checked", false);
  }

  var activateItemMenu = function(newLink) {
      var oldLink = $(".navbar-link[href='" + activeMenuOption + "']");
      oldLink.parent().removeClass("active");
      var activeLink = $(".navbar-link[href='" + newLink + "']");
      activeLink.parent().addClass("active");
      activeMenuOption = newLink;
      
  }
  
  $(".navbar-link").click(function(event) {
    event.preventDefault();
    var virtualAnchor = $(this).attr("href"); 
    smoothGoto(calculateTopElement(virtualAnchor));    
    closeMobileMenu();
    activateItemMenu(virtualAnchor);
  })

  $(".vLink").click(function() { 
    var virtualAnchor = $(this).data('url');
    smoothGoto(calculateTopElement(virtualAnchor));    
  });

  $(".downloadCV").click(function() { 
    var url = $(this).data('url');
    window.open(url, '_blank');
  });

  $(".corp-ball-radio").change(function() {
    $(".corp-description."+activeCorp).addClass("hidden");
    $(".corp-description."+ $(this).val()).removeClass("hidden");
    activeCorp = $(this).val();
  });
  
  $(".corp-description-link").click(function(){
    var virtualAnchor = $(this).data("url");
    $(".corp-ball-radio[value=" + virtualAnchor + "]").trigger("change");
    $(".corp-ball-radio[value=" + virtualAnchor + "]").prop("checked", true);
  })
});