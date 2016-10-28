var express = require("express");
var server = express();
var bodyParser = require("body-parser");
var fs = require("fs");
var jsonFile = require("jsonfile");



server.use(express.static("js"));
server.use(express.static("css"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));



server.get("/",function(req,res){
   
   res.render("index.jade");
});
server.get("/getList/searchContent/:s/whatToSearch/:o",function(req,res){
    console.log(req.params.s);
    var configFile = "";
    
    if(req.params.o == "book")
    {
        console.log("Reading File 'bookData.json'");
        configFile = fs.readFileSync("./bookData.json");
    }
    else
    {
        console.log("Reading File 'authorData.json'");
        configFile = fs.readFileSync("./authorData.json");
    }
   var jsObj = JSON.parse(configFile);
   var searchedList = [];
   if(req.params.o == "book")
   {
        for (x in jsObj)
        {
            if(jsObj[x].title == req.params.s)
            {
                searchedList.push(jsObj[x]);
                console.log("Book found and pushed into the response data");
            }
        }
   }
   else
   {
       for (x in jsObj)
        {
            console.log("Looping Author array..."+req.params.s);
            if(jsObj[x].authorName == req.params.s)
            {
                searchedList.push(jsObj[x]);
                console.log("Author details found and pushed into the response data");
            }
        }
   }
   res.send(searchedList);
});


server.get("/addBook",function(req,res){
   res.render("addBook.jade");
});
server.get("/addAuthor",function(req,res){
   res.render("addAuthor.jade");
});

server.get("/editBook/bookId/:bi",function(req,res){
    console.log(req.params.bi);
    var configFile = fs.readFileSync("./bookData.json");
    var jsObj = JSON.parse(configFile);
    var len = jsObj.length;
    var bookDetails = {};
    for(i in jsObj)
    {
        if(jsObj[i].bookId == req.params.bi)
        {
            console.log("Found Book");
            bookDetails = jsObj[i];
        }
    }
    
   res.render("editBook.jade",{ book : bookDetails } );
});

server.get("/editAuthor/authorName/:aid",function(req,res){
   console.log(req.params.aid);
    var configFile = fs.readFileSync("./authorData.json");
    var jsObj = JSON.parse(configFile);
    var len = jsObj.length;
    var authorDetails = {};
    for(i in jsObj)
    {
        if(jsObj[i].authorId == req.params.aid)
        {
            console.log("Author found");
            authorDetails = jsObj[i];
        }
    }
    
   res.render("editAuthor.jade",{ author : authorDetails } );
});
server.post("/saveBook",function(req,res){
    
 //   arr.push(req.body);
//   fs.appendFile("bookData.json",JSON.stringify(req.body));
//   fs.appendFile("bookData.json","]");
//   var x = "Empty";
//   fs.readFile("bookData.json",function(err,data){
//       JSON.parse(data);
//       x = data;
//   });
//    res.send(x);
    
    var configFile = fs.readFileSync("./bookData.json");
    var jsObj = JSON.parse(configFile);
    var len = jsObj.length;
    var lastBook = jsObj[len-1];  //Fetch last "book Object" from the "bookData.json" file which has array of "bookObjects"
    if(req.body.bookId != "")
    {   
        console.log("Editing the existing book "+req.body.bookId);
        for(var i=0;i<len;i++)
        {
            if(jsObj[i].bookId == req.body.bookId)
            {
                console.log("The Book to be edited is found"+jsObj[i].bookId+" "+req.body.bookId);
                
                jsObj[i] = req.body;
                
                break;
                
            }
        }
        
    }
    else
    {
        console.log("Storing new book data");
        var newId = 1;
        if(lastBook != null)           // If "bookData.json" file is not empty.
        {
            newId = lastBook.bookId + 1;
        }
        req.body.bookId = newId;
        jsObj.push(req.body);
    }
    
    
    var newConfigFile = JSON.stringify(jsObj);
    fs.writeFileSync("./bookData.json",newConfigFile);
    console.log("The BOok is stored.( written into 'bookData.json' file.)");
    res.redirect("/");
   
});

server.post("/saveAuthor",function(req,res){
    var configFile = fs.readFileSync("./authorData.json");
    var jsObj = JSON.parse(configFile);
    var len = jsObj.length;
    var lastAuthor = jsObj[len-1];  //Fetch last "book Object" from the "bookData.json" file which has array of "bookObjects"
    if(req.body.authorId != "")
    {  
        var configFile = fs.readFileSync("./bookData.json");
        var bookJsObj = JSON.parse(configFile);
        var len = bookJsObj.length;
        console.log("Editing the existing Author");
        for(var i in jsObj)
        {
            if(jsObj[i].authorId == req.body.authorId)
            {
                console.log("The Author to be edited is found");
                if(jsObj[i].authorName != req.body.authorName)
                {
                    console.log("Author name has changed");
                    for(var j=0;j<len;j++)
                    {
                        if(bookJsObj[j].authorId == jsObj[i].authorId)
                        {
                            console.log("The Book which Author name has changed, found"+bookJsObj[j].author+"to be"+jsObj[i].authorName);
                            bookJsObj[j].author = req.body.authorName;
                        }
                    }
                }
                jsObj[i] = req.body;
                jsObj[i].authorId = parseInt(jsObj[i].authorId);
                break;
                
            }
        }
        var newConfigFile = JSON.stringify(bookJsObj);
        fs.writeFileSync("./bookData.json",newConfigFile);
    }
    else
    {
        console.log("Storing new Author data");
        var newId = 1;
        if(lastAuthor != null)           // If "bookData.json" file is not empty.
        {
            newId = lastAuthor.authorId + 1;
        }
        req.body.authorId = newId;
        jsObj.push(req.body);
    }
    
    
    var newConfigFile = JSON.stringify(jsObj);
    fs.writeFileSync("./authorData.json",newConfigFile);
    console.log("The Auhtor details are stored.( written into 'authorData.json' file.)");
    res.redirect("/");
   
});

server.listen(8888,function(){
   console.log("server is listening on port 8888");
});


