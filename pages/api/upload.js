import pinecone,{ initialize } from "@/src/pinecone";
import formidable from "formidable-serverless";
import {connectDB} from "@/src/db";
import { s3Upload } from "@/src/s3services";
import slugify from "slugify";
import pinecone from "@/src/pinecone";

const createIndex = async()=>{
    const indexes = await pinecone.listIndexes();
    if (!indexes.includes(fileNameSlug)) {
        await pinecone.createIndex({
            createRequest:{
                name: indexName,
                dimension: 1536

            }
        });

    } else {
        throw new Error("Index already exists");
    }
}



export default async function handler(req, res) {
  // 1. only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  
  try {
   // 2. connect to the database
      await connectDB();
   // 3. get the file from the request
       let form = new formidable.IncomingForm();
         form.parse(req, async (error, fields, files) => {
            if (error) {
            console.error("Error parsing the file", error);
            return res.status(500).json({ message: "Internal server error" });
            }
            const file = files.file
            if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
            }
            // 4. upload the file to aws s3
            let data = await s3Upload(process.env.S3_BUCKET, file);
            const fileNameNoExt = file.name.split(".")[0];
            const fileNameSlug = slugify(fileNameNoExt, {
                lower: true,
                strict: true,
            })

            // 5. initialize the pinecone client
            await initialize();

            // 6. create the index if it doesn't exist
            await CreateIndex(fileNameSlug)

            // 7. save the file to the database
            const myFile = new MyFileModel({
                fileName: file.name,
                fileUrl: data.Location,
                vectorIndex: fileNameSlug

            })
            await myFile.save();

              // 8. return the response
              return res.status(200).json({
                message: "File uploaded successfully",
              })



         })
 
  
  

  } catch (e) {
    console.log("MongoDB connection error", e);
    return res.status(500).json({ message: "Internal server error" });
  }
  
}
