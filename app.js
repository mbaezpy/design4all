/* App main file */
$(document).ready(function(){
  
    Guide.loadGuidelines(function(data){    
      
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
        .replace(/{ability_1}/g, post.ability_1)
        .replace(/{ability_2}/g, post.ability_2)
        .replace(/{design_1}/g, post.design_1)
        .replace(/{design_2}/g, post.design_2)
        .replace(/{device}/g, post.device)
        .replace(/{ref_title}/g, post.ref_title)
            
      $(opt.el).append(item);
    });
  }
};


