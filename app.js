/* @author Marcos baez <marcos@baez.io> */
$(document).ready(function(){
  
    // loading guidelines with no filters by default
    Guide.loadGuidelines(function(data){          
      GuideView.renderSummary({
        collection : data,
        tmpl : $("#summary-tmpl"),
        el   : $(".summary")    
      });
      GuideView.renderGuidelines({
        collection : data, 
        tmpl : $("#guide-tmpl"),
        el   : $(".guidelines"),      
      });                           
    });
  
    // any change in the filters
    $(".filter-simple select").change(function(e){      
      var filters = [];
      // we build automatically the filters array from existing form-controls
      $(".filter-simple .form-control").each(function(i,el){
        filters.push({ key : this.id.replace("filter-",""), value : $(this).val()});      
      });
      
      // and we filter the guidelines
      Guide.filter(filters, function(data){
        GuideView.renderSummary({
          collection : data,
          tmpl : $("#summary-tmpl"),
          el   : $(".summary")    
        });
        GuideView.renderGuidelines({
          collection : data, 
          tmpl : $("#guide-tmpl"),
          el   : $(".guidelines"),      
        });         
      });
      
    });  
});

/* Basic Guidelins data manipulation functions */
var Guide = {
  
  _guidelines : [],
    
  /* Load the list of guidelines 
   * @param callback function fn(collection) that recieve an array of guideline objects
   */
  loadGuidelines : function(callback){
     $.getJSON("guidelines.php", function(data){
        callback(data);
        Guide._guidelines = data;
     });        
  },
  
  /* Filters the original guideline list 
   *  @param f an array of {key : <json attr>, value : <attr value>} filters over the json attributes
   *   @param callback a function fn(collection) that received the filtered array 
   */
  filter : function(f, callback){
        
    var list = $.grep(this._guidelines, function(el,i){
       var r=true;
       for(k=0; k<f.length; k++){
         r = r && (f[k].value == "" || f[k].value == el[f[k].key].toLowerCase());
       }
      return r;                
    });
    
    callback(list);
  }  
};

/* Basic rendering functions */
GuideView = {
  /* Renders the search results summary
   * @param opt object {collection : <guidelines>, tmpl : <template>, el : <target dom>} elements
   */
  renderSummary : function(opt){
    var tot = opt.collection.length;
    var cat = $.map(opt.collection, function(n){ return n.design_2});
    var ppr = $.map(opt.collection, function(n){ return n.ref});
    
    var summary = opt.tmpl.text()
              .replace(/{nguide}/g, tot)
              .replace(/{npapers}/g, $.unique(cat).length)
              .replace(/{ncategories}/g, $.unique(ppr).length);
    $(opt.el).empty().append(summary);
    
  },
  
  /* Renders the search results
   * @param opt object {collection : <guidelines>, tmpl : <template>, el : <target dom>} elements
   */  
  renderGuidelines : function(opt){
    $(opt.el).empty();
    
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