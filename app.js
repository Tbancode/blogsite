const express = require("express")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const ejs = require("ejs")
const mongoose = require("mongoose")
const _ = require("lodash")

const app = express()



const homeStartingContent = "After the engineer obtains a mathematical representation of a subsystem,the subsystem is analyzed"
const aboutContent = "They are made up of mainly passive components of lumped or distributed characteristics. As passive circuits, they are essentially stable, that is, given a finite input signal, their output shot remain finite. "
const contactContent = "Filters can be divided into two distinct types: active filters and passive filters. Active filters contain amplifying devices to increase signal strength while passive do not contain amplifying devices to strengthen the signal. "

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/blogDB'
, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(methodOverride("_method"))
app.set('view engine', "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

const blogSchema = {
  name : String,
  content : String
}

const blog = new mongoose.model("Blog", blogSchema);


app.get("/", function(req, res){
blog.find({})
    .then(function(result){



    res.render("home", {Content: homeStartingContent, posts:result})
    })

});

app.get('/about', function(req, res){
  res.render("about", {About: aboutContent})
});

app.get("/contact", function(req, res){
  res.render("contact", {Contact: contactContent})
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
const title = req.body.compose;
const cont = req.body.tarea;
  const post = blog({
  name:  title,
  content: cont
});

post.save()
    .then(function(err){
      if(!err){
        res.redirect("/")
      }
    })
// posts.push(post)

})




app.get("/post/:blogId", function(req, res){
  const requestedId = req.params.blogId;
  blog.findOne({_id: requestedId})
      .then(function(post){
        if(post){
      res.render("post", {title: post.name, content: post.content});
      }
      })
});

app.delete("/post/:postID", function(req, res){
  const postid = req.params.postID;
  res.redirect("/")
});


app.post("/delete/:blogId", function(req, res){
  // const deleted = req.body.delete
  const itemID = req.params.blogId;
  blog.findByIdAndRemove(itemID)
  .then(function(result){
      console.log("Succesfully Deleted")
res.redirect("/");
})
});



app.listen(3000, function(){
  console.log("Server running on port 3000")
});
