import mongoose from "mongoose";
const Schema = mongoose.Schema;

const myFileSchema = new Schema({
    fileName: {
        type: String,
        required: [true, "File name is required"],
        maxLength: 100,
        unique: true
    },
    fileUrl : {
        type: String,
        required: [true, "File url is required"],
        maxLength: 100,
        unique: true
    },
    vectorIndex: {
        type: String,
        required: false,
        maxLength: 100,
        unique: true
    },
    isProcessed:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    
})

const MyFileModel = mongoose.models.MyFile || mongoose.model("MyFile", myFileSchema);

export default MyFileModel;