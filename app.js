const bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      express = require('express'),
      app = express();
      methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/blogApp', {useNewUrlParser:true})
.then(()=>{
    console.log('Connected to mongoDB');
})
.catch(()=>{
    console.log('Error connecting to DB');
});

//App config
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//mongoose model config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

//restful routes
// Blog.create({
//     title:'dog',
//     image:'https://thenypost.files.wordpress.com/2018/05/180516-woman-mauled-by-angry-wiener-dogs-feature.jpg?quality=90&strip=all&w=618&h=410&crop=1',
//     body:'A Dog of pure goodwill'
// }, function(err, res){
//     if(err) return console.log(err);
//         console.log(res);
// });

app.get('/', function(req, res){
    res.redirect('/blogs');
});

//INDEX route
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err) return console.log(err);
            res.render('index', {blogs:blogs});
    }); 
});

//New Route
app.get('/blogs/new', function(req, res){
    res.render('new');
});

//Create Route
app.post('/blogs', function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) return res.render('new');
            res.redirect('/blogs');
    });
});

//Show route
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, (err, blog)=>{
        if(err) return res.redirect('/blogs');
            res.render('show', {blog:blog});
    })
});

//Edit Route
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err) return res.redirect('/blogs');
         res.render('edit', {blog:blog});
    });
    
});

//update route
app.put('/blogs/:id', function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if(err) return res.redirect('/blogs');
            res.redirect(`/blogs/${req.params.id}`);
    });
});

app.delete('/blogs/:id', function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err) return res.redirect('/blogs');
            return res.redirect('/blogs');
    });
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});

