---
layout: layout.njk
title: Timecode Exporter
date: 2023-01-01
---

# Timecode Exporter
### Generate TC in the Viory format

![Timecode Exporter](/img/timecode-exporter.png){.small}



[Download for Windows](https://github.com/Bureau-Documentation/Timecode-Exporter/releases/download/v2.0.0/Windows_v2.0.0.zip)

[Download for Mac](https://github.com/Bureau-Documentation/Timecode-Exporter/releases/download/v2.0.0/Mac_Intel_v2.0.0.zip)

[Online version](#online-version)

***

<video controls preload="metadata"><source src="https://github.com/Bureau-Documentation/Bureau-Documentation/raw/refs/heads/main/src/video/Premiere%20%7C%20Timecode%20Exporter%20Tutorial.webm#t=0.1" type="video/mp4"/></video>
<video controls preload="metadata"><source src="https://github.com/Bureau-Documentation/Bureau-Documentation/raw/refs/heads/main/src/video/Resolve%20%7C%20Timecode%20Exporter%20Tutorial.webm#t=0.1" type="video/mp4"/></video>

***

# Online version
<div style="text-align:center;">
    <div id="drop-area" onclick="document.getElementById('fileElem').click();">
        Drop the .edl file here or click to upload
    </div>
    <button id="copyButton" style="display: none;">Copy to Clipboard</button>
    <input type="file" id="fileElem" accept=".edl" style="display: none;" />
    <pre id="timecodes" style="display: none;"></pre>
</div>

<script>
    const dropArea = document.getElementById("drop-area");
    const fileElem = document.getElementById("fileElem");
    const timecodesDiv = document.getElementById("timecodes");
    const copyButton = document.getElementById("copyButton");

    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    dropArea.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files.length) {
            const file = files[0];
            updateDropAreaMessage(`Uploading file: ${file.name}...`);
            handleFile(file);
        }
    });

    fileElem.addEventListener("change", (e) => {
        const files = e.target.files;
        if (files.length) {
            const file = files[0];
            updateDropAreaMessage(`Uploading file: ${file.name}...`);
            handleFile(file);
        }
    });

    function handleFile(file) {
        if (file.name.endsWith(".edl")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                const timeRanges = extractTimecodes(content);
                displayTimecodes(timeRanges);
            };
            reader.readAsText(file);
        } else {
            updateDropAreaMessage("Not a valid .edl file");
        }
    }

    function extractTimecodes(content) {
        const lines = content.split("\n");
        const timeRanges = [];
        for (const line of lines) {
            const columns = line.trim().split(/\s+/);
            if (columns.length > 7 && !isNaN(columns[0])) {
                const startTime = columns[6].substring(0, 8);
                const endTime = columns[7].substring(0, 8);
                timeRanges.push(`${startTime} to ${endTime}`);
            }
        }
        return timeRanges;
    }

    function displayTimecodes(timeRanges) {
        if (timeRanges.length > 0) {
            // Display timecodes and show copy button
            timecodesDiv.innerText = timeRanges.join("\n");
            timecodesDiv.style.display = "block";
            copyButton.style.display = "inline-block";
            updateDropAreaMessage("Timecodes have been generated\nDouble check them!");
        } else {
            timecodesDiv.innerText = "No valid timecodes found";
            timecodesDiv.style.display = "block";
            copyButton.style.display = "none";
            updateDropAreaMessage("No valid timecodes found");
        }
    }

    function updateDropAreaMessage(message) {
        dropArea.innerText = message;
    }

    copyButton.addEventListener("click", () => {
        // Joining timecodes with two new lines for extra spacing
        const timecodes = timecodesDiv.innerText.split("\n").join("\n\n");
        navigator.clipboard.writeText(timecodes).then(
            () => {
                updateDropAreaMessage("Timecodes are copied to clipboard!");
                timecodesDiv.style.display = "none"; // Hide the <pre> element
            },
            (err) => {
                console.error("Could not copy text: ", err);
            }
        );
    });
</script>