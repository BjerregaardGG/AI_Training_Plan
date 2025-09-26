require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express(); 

app.use(express.json()); // appen gør brug af en biblioteks metode -> sets up body parsing 

const N8N_URL = process.env.N8N_WEBHOOK_URL;
const N8N_KEY = process.env.N8N_SECRET_KEY;

// sikkerhedsfeature --> 
app.use(express.static("public"));

app.get("/training_program", (req, res) => {
    res.sendFile(path.resolve("public/index.html"))
});

app.post("/training_program", async (req, res) => {
    const training_information = req.body; 

    if (!training_information) {
        return res.status(404).send("Could not post training information"); 
    } 

    console.log("Received training data:", training_information);
    
    // Send til n8n (fire-and-forget)
    sendToN8n(training_information);
    
    // Send success response tilbage til frontend med det samme
    res.json({ 
        success: true,
        message: "Data received and sent to n8n",
        data: training_information
    });

});

async function sendToN8n(user_data){

    try {
        const response = await fetch(N8N_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": N8N_KEY
            }, 
            body: JSON.stringify(user_data)
    });

    if (!response) {
        console.log("Error fetching to n8n")
    } else {
        console.log("Sucessfully sent to n8n")
    }

    } catch (error) {
    console.error("Error sending to n8n:", error.message);
    }
};

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});

