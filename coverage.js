var File={fs:require("fs"),save:function(a,d){this.fs.write(a,d,"w")},copy:function(a,d,b,c){for(var e in a){var h=d+"/"+(b&&c?this.cleanPath(a[e],c):this.getFilenameFromPath(a[e]));this.fs.copy(a[e],h)}},getFilenameFromPath:function(a){a=a.split("/");return a[a.length-1]},cleanPath:function(a,d){a=a.replace(d,"");for(a=a.split("/").join(".");a.charAt(0)===".";)a=a.substr(1,a.length-1);return a},cleanPaths:function(a,d){var b=[],c;for(c in a)b[c]=this.cleanPath(a[c],d);return b},js:function(a){if(typeof a===
"string"&&this.fs.isFile(a)&&a.indexOf(".js")!==-1)phantom.injectJs(a);else try{for(var d in a)this.js(a[d])}catch(b){console.log("Unable to load file "+a)}},dir:function(a){if(this.fs.isDirectory(a)){var a=this.scan(a),d;for(d in a)this.js(a[d])}else console.log("Unable to open directory "+a)},scan:function(a){for(var d=[],b=this.fs.list(a),c=0;c<b.length;c++)if(b[c]!=="."&&b[c]!==".."){var e=a+this.fs.separator+b[c];this.fs.isFile(e)&&e.indexOf(".js")!==-1?d.push(e):this.fs.isDirectory(e)&&(d=d.concat(this.scan(e)))}return d}};var JUnit={generateReport:function(a){return a.evaluate(function(){var a=getReport(),b=[];b.push("<?xml version='1.0' encoding='UTF-8'?>");b.push("<testsuite tests='"+a.count+"' failures='"+a.failures+"' disabled='0' errors='0' time='"+a.time/1E3+"' name='tests'>");for(var c in a.modules){var e=a.modules[c];b.push("\t<testsuite tests='"+e.count+"' failures='"+e.failures+"' disabled='0' errors='0' time='"+e.time/1E3+"' name='"+c+"'>");for(var h in e.tests){var j=e.tests[h];b.push("\t\t<testcase name='"+
h+"' status='"+(j.success?"pass":"fail")+"' time='"+j.time/1E3+"' classname='"+c+"' />")}b.push("\t</testsuite>")}b.push("</testsuite>");console.log("Tests completed ("+a.count+"): "+a.time+"ms.");console.log("\t"+a.passed+" passed");console.log("\t"+a.failures+" failed");return b.join("\n")})}};function waitFor(a,d,b){var c=b?b:3001,e=(new Date).getTime(),h=false,j=setInterval(function(){var b=(new Date).getTime()-e;if(b<c&&!h)h=a();else{clearInterval(j);if(!h)throw"waitFor() timeout";console.log("Page load time: "+b+"ms.");d()}},250)};var Template={fs:require("fs"),get:function(a,d){var b=this.fs.read(a),c;for(c in d)b=b.replace("{{ "+c+" }}",d[c]);return b},getScripts:function(a){var d=[],b;for(b in a)d.push("<script type='text/javascript' src='"+a[b]+"'><\/script>");return d.join("\n")}};var Testsuite={fs:require("fs"),get:function(a){console.log("Working from "+this.fs.workingDirectory);return{workingDirectory:this.fs.workingDirectory,tests:File.scan(a),binPath:this.fs.workingDirectory+"/build/bin",sourcePath:this.fs.workingDirectory+"/build/src"}},create:function(a){this.fs.makeTree(a.binPath);this.fs.makeTree(a.sourcePath)},clean:function(a){this.remove(a)},remove:function(a){this.fs.removeTree(a.workingDirectory+"/build")}};var Cobertura={generateReport:function(a){return a.evaluate(function(){function a(b){return b.indexOf(".")!==-1?(b=b.split("."),b.pop(),b.pop(),b.join(".")):""}function b(a){if(a.indexOf(".")!==-1){for(a=a.split(".");a.length>2;)a.shift();return a.join(".")}else return a}var c={},e=0,h=0,j=0,m=0,g=0;if(_$jscoverage)for(var f in _$jscoverage)if(_$jscoverage.hasOwnProperty(f)){var n=_$jscoverage[f],i=a(f),k=b(f);e++;c[i]||(h++,c[i]={classes:{},testableLines:0,testedLines:0,untestedLines:0});c[i].classes[f]=
{source:n.source,file:f,classPath:i,fileName:k,testableLines:0,testedLines:0,untestedLines:0,coverage:{}};for(k=0;k<n.source.length;k++){var k=parseInt(k,10),o=n[k+1],p=0;o!==void 0?(j++,c[i].testableLines++,c[i].classes[f].testableLines++,o>0&&(p=o,m++,c[i].testedLines++,c[i].classes[f].testedLines++),c[i].classes[f].coverage[k]={hits:p}):(g++,c[i].untestedLines++,c[i].classes[f].untestedLines++)}}g=[];g.push("<?xml version='1.0' encoding='UTF-8'?>");g.push("<!DOCTYPE coverage SYSTEM 'http://cobertura.sourceforge.net/xml/coverage-03.dtd'>");
g.push("<coverage line-rate='"+m/j+"' branch-rate='0' version='3.5.1' timestamp='"+(new Date).getTime().toString()+"'>");g.push("\t<sources/>");g.push("\t<packages>");for(f in c){g.push("\t\t<package name='"+f+"' line-rate='"+c[f].testedLines/c[f].testableLines+"' branch-rate='0' complexity='0'>");g.push("\t\t\t<classes>");for(var l in c[f].classes){g.push("\t\t\t\t<class name='"+l+"' filename='"+c[f].classes[l].fileName+"' line-rate='"+c[f].classes[l].testedLines/c[f].classes[l].testableLines+"' branch-rate='0'>");
g.push("\t\t\t\t\t<lines>");for(var q in c[f].classes[l].coverage)g.push("\t\t\t\t\t\t<line number='"+(parseInt(q,10)+1).toString()+"' hits='"+c[f].classes[l].coverage[q].hits.toString()+"' branch='false' />");g.push("\t\t\t\t\t</lines>");g.push("\t\t\t\t</class>")}g.push("\t\t\t</classes>");g.push("\t\t</package>")}g.push("\t</packages>");g.push("</coverage>");console.log("Coverage measured ("+Math.round(m/j*100)+"%):");console.log("\t"+h+" packages");console.log("\t"+e+" files");return g.join("\n")})}};var Coverage={args:[],options:{},requiredPrepareOptions:["src","libs","templates"],requiredRunOptions:["libs","junit","templates","cobertura","qunit"],testSuite:null,page:null,initialize:function(a){this.args=a;this.options=this.getOptions(a);this.verify(this.args[0]);switch(this.args[0]){case "prepare":this.prepare();break;case "run":this.run()}},getOptions:function(a){for(var d={},b=0;b<a.length;b++)a[b].indexOf("--")===0&&(b+1<a.length&&a[b+1].indexOf("--")===0?d[a[b].replace("--","")]=true:b+
1<a.length&&(d[a[b].replace("--","")]=a[b+1]));return d},verify:function(){if(this.args.length<2||this.args[1].indexOf("--")!==-1)console.log("Usage: coverage.js prepare/run <testdir>"),phantom.exit(1);else{var a=this.args[0]==="prepare"?this.requiredPrepareOptions:this.requiredRunOptions,d;for(d in a)this.options[a[d]]||(console.log("Option "+a[d]+" not set, usage: coverage.js prepare/run <testdir> --"+a[d]+" <value>"),phantom.exit(1))}},isTestCompeted:function(){return this.page.evaluate(function(){var a=
document.getElementById("qunit-testresult");return a&&a.innerText.indexOf("completed")!==-1})},createReports:function(){var a=Cobertura.generateReport(this.page),d=JUnit.generateReport(this.page);File.save(this.options.cobertura,a);File.save(this.options.junit,d)},prepare:function(){this.testSuite=Testsuite.get(this.args[1]);Testsuite.clean(this.testSuite);Testsuite.create(this.testSuite);var a=File.scan(this.options.libs),d=Template.getScripts(File.cleanPaths(a,this.options.libs)),a=File.scan(this.options.src),
b=Template.getScripts(File.cleanPaths(a,this.options.src)),c=Template.getScripts(File.cleanPaths(this.testSuite.tests,this.args[0])),d=Template.get(this.options.templates+"/testrunner.html",{libScripts:d,sourceScripts:b,scripts:c});File.copy(a,this.testSuite.sourcePath,true,this.options.src);File.save(this.testSuite.sourcePath+"/testrunner.html",d);phantom.exit(0)},run:function(){this.testSuite=Testsuite.get(this.args[1]);File.copy(this.testSuite.tests,this.testSuite.binPath,true,this.args[0]);File.copy(File.scan(this.options.libs),
this.testSuite.binPath,true,this.options.libs);File.copy([this.options.qunit+"/qunit.js",this.options.qunit+"/qunit-coverage.js",this.options.qunit+"/qunit.css"],this.testSuite.binPath);this.page=new WebPage;this.page.onConsoleMessage=function(a){console.log(a)};this.page.open(this.testSuite.binPath+"/testrunner.html",function(a){if(a!=="success")throw"Unable to access network";else waitFor(function(){return Coverage.isTestCompeted()},function(){Coverage.createReports();Testsuite.remove(Coverage.testSuite);
phantom.exit(0)},6E4)})}};Coverage.initialize(phantom.args);