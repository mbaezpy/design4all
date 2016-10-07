/* App main file */
$(document).ready(function(){
  
    Guide.loadGuidelines(function(data){
      
      // positioning randomly the three galleries
      
      Guide.renderGuidelines({
        collection : data, 
        tmpl : $("#guide-tmpl"),
        el   : $(".guidelines")
      });
                          
    });
  
});
  
var Guide = {
  
  loadGuidelines : function(callback){
     $.getJSON("guidelines.php", function(data){
        callback(data);
     });        
  },
  
  renderGuidelines : function(opt){
    opt.collection.forEach(function(post){
      
      var item = opt.tmpl.text()
        .replace(/{guideline}/g, post.guideline)
      
      $(opt.el).append(item);
    });
  }
};


