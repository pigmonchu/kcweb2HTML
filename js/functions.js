$().ready(function() {
  
// ----- PROPORTIONS -----
  
  var _sections = [
    { href: "#experience" } ,
    { href: "#projects" }, 
    { href: "#whoiam" },
    { href: "#contact" }
  ];

  var _navBarHeight;

  var fixOffsets = function(event) {
    _navBarHeight = $(".navbar").height();
    
    for (var i=0; i< _sections.length; i++) {
      _sections[i].offset = $(_sections[i].href).offset().top - _navBarHeight;
    }
    
    _sections.sort(function(a, b){
      return (b.offset - a.offset);
    });
       
    changeMenuStyle();
  }
  
  var smoothGoto = function(scrollTop) {
    $('body,html').animate({
    	scrollTop: scrollTop - _navBarHeight + 2
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

// ----- MENU -----

  var activeMenuOption = "#";

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
  
  var changeMenuStyle = function changeMenuStyle(event) {
      for (var i=0; i< _sections.length; i++) {
        if (window.pageYOffset > _sections[i].offset) {
          activateItemMenu(_sections[i].href);
          return;
        }
      }
      activateItemMenu("body");
  }
 
// ----- EVENTOS ----- 

  var activeCorp = $(".corp-ball-radio:checked").val();

  $(".navbar-link").click(function(event) {
    event.preventDefault();
    var virtualAnchor = $(this).attr("href"); 
    smoothGoto(calculateTopElement(virtualAnchor));    
    closeMobileMenu();
//    activateItemMenu(virtualAnchor);
  })

  $(".vLink").click(function(event) { 
		event.preventDefault();
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
    smoothGoto(calculateTopElement("#jobs-history"));
  });
  
  $(".corp-description-link").click(function(){
    var virtualAnchor = $(this).data("url");
    $(".corp-ball-radio[value=" + virtualAnchor + "]").trigger("change");
    $(".corp-ball-radio[value=" + virtualAnchor + "]").prop("checked", true);
  })
  
  window.addEventListener('scroll', changeMenuStyle);
  
  window.addEventListener('resize', function(event) {
	  fixOffsets(event); 
	  changeMenuStyle(event);
	});


// ----- INICIO -----
  fixOffsets();
  changeMenuStyle();
  
});