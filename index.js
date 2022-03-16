const express=require("express");
const app=express();
const mongoose = require('mongoose');
const methodOverride=require("method-override");

main().then(() => {
    console.log("Connected!!");
}).catch(err => {
    console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/notesApp', { useNewUrlParser: true, useUnifiedTopology: true });
}

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const notesSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
})

const Notes=mongoose.model("Notes",notesSchema);


app.get("/mynotes",async(req,res)=>{
    // res.send("Aaja tujhe notes dikhaun!");
    const notes=await Notes.find();
    res.render("index",{notes});
    // console.log(notes);
})


app.get("/mynotes/add",(req,res)=>{
    res.render("addNote");
})

app.post("/mynotes",async(req,res)=>{
    // res.send(req.body);
    // console.log(req.body.note);
    const newNote=new Notes(req.body);
    await newNote.save();
    res.redirect("/mynotes");
})
app.put("/mynotes/:id",async(req,res)=>{
    const {id}=req.params;
    const {title,content}=req.body;
    console.log(title,content);
    const note=await Notes.findByIdAndUpdate(id,req.body);
    res.redirect("/mynotes");
})
app.get("/mynotes/:id",async(req,res)=>{
    const note=await Notes.findById(req.params.id);
    res.render("edit",{note});
})



app.delete("/mynotes/:id",async(req,res)=>{
    const {id}=req.params;
    const note=await Notes.findByIdAndDelete(id);
    res.redirect("/mynotes");
})

app.listen(8080,()=>{
    console.log("listening!");
})