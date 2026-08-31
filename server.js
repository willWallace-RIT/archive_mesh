const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Mock endpoint for fetching local mission manifests/lists
app.get('/v1/ugc/missions/nearby', (req, res) => {
    res.json({
        status: "success",
        total_missions: 1,
        missions: [
            {
                id: "local_test_001",
                title: "Community Restored Mission",
                author: "Archivist",
                download_url: "http://10.147.20.10:8080/v1/ugc/download/local_test_001.inf2"
            }
        ]
    });
});

// Binary blob serving endpoint for actual user-generated content payloads
app.get('/v1/ugc/download/:file', (req, res) => {
    const filePath = path.join(__dirname, 'storage/ugc_payloads', req.params.file);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send("Payload not found on local master node.");
    }
});

app.listen(8080, '10.147.20.10', () => {
    console.log('Local infrastructure backend running on http://10.147.20.10:8080');
});
