this["MyApp"]["templates"]["upload"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<p>Build and upload the site</p>\n\n<form method=\"post\">\n  <p><input type=\"submit\" value=\"Build\"></p>\n</form>\n\n<p>\n  <pre class=\"js-build-info\"></pre>\n</p>\n\n"
    + ((stack1 = this.invokePartial(partials.preview,depth0,{"name":"preview","hash":{"previewPath":"/"},"data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"usePartial":true,"useData":true});