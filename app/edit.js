this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["edit"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<form method=\"post\">\n"
    + ((stack1 = this.invokePartial(partials.fields,depth0,{"name":"fields","hash":{"fieldPrefix":"","editorSource":(depth0 != null ? depth0.editorSource : depth0),"fields":((stack1 = (depth0 != null ? depth0.editorConfig : depth0)) != null ? stack1.fields : stack1),"editorConfig":(depth0 != null ? depth0.editorConfig : depth0)},"data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "<p>\n  <input type=\"submit\" value=\"Save\">\n</p>\n</form>\n"
    + ((stack1 = this.invokePartial(partials.preview,depth0,{"name":"preview","hash":{"previewPath":((stack1 = (depth0 != null ? depth0.editorConfig : depth0)) != null ? stack1.previewPath : stack1)},"data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"usePartial":true,"useData":true});