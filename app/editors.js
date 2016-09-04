this["MyApp"]["templates"]["editors"] = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "    <li><a href=\"/"
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].config : depths[1])) != null ? stack1.editBasePath : stack1), depth0))
    + "/"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.name : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.title : stack1), depth0))
    + "</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<h1>Editor</h1>\n<ul>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.editors : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 1, blockParams, depths),"inverse":this.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "</ul>\n"
    + ((stack1 = this.invokePartial(partials.preview,depth0,{"name":"preview","hash":{"previewPath":"/"},"data":data,"blockParams":blockParams,"helpers":helpers,"partials":partials})) != null ? stack1 : "");
},"usePartial":true,"useData":true,"useDepths":true,"useBlockParams":true});