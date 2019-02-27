const GUIDELINES_URL = "https://spreadsheets.google.com/feeds/list/10Hddff_xLBYvynbsIjYZLAOQvs8vzgmS21X7DMYmP5o/1/public/full?alt=json";
const PAPERS_URL = "https://spreadsheets.google.com/feeds/list/10Hddff_xLBYvynbsIjYZLAOQvs8vzgmS21X7DMYmP5o/2/public/full?alt=json";

$(document).ready(function () {

  // loading guidelines with no filters by default
  Guide.loadGuidelines(function (data) {
    GuideView.renderSummary({
      collection: data,
      tmpl: $("#summary-tmpl"),
      el: $(".summary")
    });
    GuideView.renderGuidelines({
      collection: data,
      tmpl: $("#guide-tmpl"),
      el: $(".guidelines"),
    });
  });

  // loading papers with no filters by default
  Guide.loadPapers(function (dataPpr) {
    GuideView.renderSummaryPapers({
      collection: dataPpr,
      tmpl: $("#summary-tmpl-ppr"),
      el: $(".paperListSummary")
    });
    GuideView.renderPapers({
      collection: dataPpr,
      tmpl: $("#paper-tmpl"),
      el: $(".paperList"),
    });
  });

  // any change in the filters
  $(".filter-simple select").change(function (e) {
    var filters = [];
    // we build automatically the filters array from existing form-controls
    $(".filter-simple .form-control").each(function (i, el) {
      filters.push({
        key: this.id.replace("filter-", ""),
        value: $(this).val()
      });
    });

    // and we filter the guidelines
    Guide.filter(filters, function (data) {
      GuideView.renderSummary({
        collection: data,
        tmpl: $("#summary-tmpl"),
        el: $(".summary")
      });
      GuideView.renderGuidelines({
        collection: data,
        tmpl: $("#guide-tmpl"),
        el: $(".guidelines"),
      });
    });

  });
});

/* Basic Guidelins data manipulation functions */
var Guide = {

  _guidelines: [],

  /* Load the list of guidelines 
   * @param callback function fn(collection) that recieve an array of guideline objects
   */
  loadGuidelines: function (callback) {

    $.getJSON(GUIDELINES_URL, function (data) {
      var rawGuidelineList = data.feed.entry;
      var guidelineList = [];
      for (i = 0; i < rawGuidelineList.length; i++) {
        var guidelineItem = {
          id: rawGuidelineList[i].gsx$id.$t,
          count: rawGuidelineList[i].gsx$count.$t,
          ability_1: rawGuidelineList[i].gsx$ability1.$t,
          ability_2: rawGuidelineList[i].gsx$ability2.$t,
          severity: rawGuidelineList[i].gsx$severity.$t,
          design_1: rawGuidelineList[i].gsx$design1.$t,
          design_2: rawGuidelineList[i].gsx$design2.$t,
          guideline: rawGuidelineList[i].gsx$guideline.$t,
          ref: rawGuidelineList[i].gsx$ref.$t,
          ref_title: rawGuidelineList[i].gsx$reftitle.$t,
          device: rawGuidelineList[i].gsx$device.$t
        };
        guidelineList.push(guidelineItem);
        console.log(i);
      }
      callback(guidelineList);
      Guide._guidelines = guidelineList;
    });
  },

  /* Load the list of papers 
   * @param callback function fn(collection) that recieve an array of paper objects
   */
  loadPapers: function (callback) {
    $.getJSON(PAPERS_URL, function (data) {
      var rawPaperList = data.feed.entry;
      var paperList = [];
      for (i = 0; i < rawPaperList.length; i++) {
        var paperItem = {
          id: rawPaperList[i].gsx$id.$t,
          title: rawPaperList[i].gsx$title.$t
        };
        paperList.push(paperItem);
      }
      callback(paperList);
    });
  },

  /* Filters the original guideline list 
   *  @param f an array of {key : <json attr>, value : <attr value>} filters over the json attributes
   *   @param callback a function fn(collection) that received the filtered array 
   */
  filter: function (f, callback) {

    var list = $.grep(this._guidelines, function (el, i) {
      var r = true;
      for (k = 0; k < f.length; k++) {
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
  renderSummary: function (opt) {
    var tot = opt.collection.length;
    var cat = $.map(opt.collection, function (n) {
      return n.design_2
    });
    var ppr = $.map(opt.collection, function (n) {
      return n.ref
    });

    var summary = opt.tmpl.text()
      .replace(/{nguide}/g, tot)
      .replace(/{npapers}/g, $.unique(ppr).length)
      .replace(/{ncategories}/g, $.unique(cat).length);
    $(opt.el).empty().append(summary);

  },

  /* Renders the search results summary of papers
   * @param opt object {collection : <guidelines>, tmpl : <template>, el : <target dom>} elements
   */
  renderSummaryPapers: function (opt) {
    var tot = opt.collection.length;

    var summary = opt.tmpl.text()
      .replace(/{npapers}/g, tot);
    $(opt.el).empty().append(summary);

  },

  /* Renders the search results
   * @param opt object {collection : <guidelines>, tmpl : <template>, el : <target dom>} elements
   */
  renderGuidelines: function (opt) {
    $(opt.el).empty();

    opt.collection.forEach(function (post) {
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

  },

  /* Renders the search results
   * @param opt object {collection : <guidelines>, tmpl : <template>, el : <target dom>} elements
   */
  renderPapers: function (opt) {
    $(opt.el).empty();

    opt.collection.forEach(function (post) {
      var item = opt.tmpl.text()
        .replace(/{ref}/g, post.id)
        .replace(/{ref_title}/g, post.title)

      $(opt.el).append(item);
    });

  }
};
