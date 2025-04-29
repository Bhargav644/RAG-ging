import express from "express"
import cors from "cors";
import multer from "multer"



const app =express();
app.use(cors());


app.get("/",(req,res)=>{
    return res.json({message:"Hello World"});
})


// storage of files and upload code below


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname + '-' + uniqueSuffix)
    }
})
  
const upload = multer({ storage: storage })

app.post("/upload",upload.single("pdf"),(req,res)=>{
    console.log("her i was")
    return res.json({message:"File Uploaded Successfully"});
})




app.listen(8000,()=>console.log("Server Started on Port 8000"));