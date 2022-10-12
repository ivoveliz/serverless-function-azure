const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const keepAliveSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true
    },
    
    valoravg: {
        type: String,
        required: true
    },
    valorcur: {
        type: String,
        required: true
    },
    valorcurmax: {
        type: String,
        required: true
    },
    valorcurmin: {
        type: String,
        required: true
    },
    created_at: {
        type: Date, 
        required: true, 
        default: Date
        
    }
})

module.exports = mongoose.model('uplink', keepAliveSchema)