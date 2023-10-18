const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");


const blogSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title:{
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
    image:{
        type: String,
    },
    category:{
        type:String,
        required: true,

    }
    
},{
    timestamps: true,
})

blogSchema.plugin(mongoose_delete, {
    overrideMethods: "all",
    deletedAt: true,
  });
  
  module.exports = mongoose.model("Blog", blogSchema);
  