document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generateBtn');
    const linkDisplay = document.getElementById('linkDisplay');
    const codeInputContainer = document.getElementById('codeInputContainer');
    const codeInput = document.getElementById('codeInput');
    const okBtn = document.getElementById('okBtn');
    const prizeDisplay = document.getElementById('prizeDisplay');

    let codePrizeMap = {}; // Map to store code-prize pairs
    const API_TOKEN = '60ac6e09cf024bfdea99acb26a547be6'; // Replace with your API token

    generateBtn.addEventListener('click', function () {
        const code = generateCode(); // Generate a random code
        const prize = generatePrize(); // Generate a random prize name

        // Store the code-prize pair in the map
        codePrizeMap[code] = prize;

        // Create a text file with the code
        const file = new File([code], 'generated_file.txt', { type: 'text/plain' });

        // Upload the text file
        uploadFile(file, code);
        
        // Display the link with the generated code and the input box
        codeInputContainer.style.display = 'block';
    });

    okBtn.addEventListener('click', function () {
        const code = codeInput.value.trim();
        if (code && codePrizeMap[code]) {
            prizeDisplay.textContent = codePrizeMap[code]; // Display the prize name if code is valid
        } else {
            prizeDisplay.textContent = 'Invalid code'; // Display message for invalid code
        }
    });

    // Function to generate a random code
    function generateCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    // Function to generate a random prize name
    function generatePrize() {
        const prizes = ['Free Gift', 'Discount Coupon', 'Bonus Points', 'Special Offer'];
        return prizes[Math.floor(Math.random() * prizes.length)];
    }

    // Function to upload a file to the server
    function uploadFile(file, code) {
        const formData = new FormData();
        formData.append('token', API_TOKEN);
        formData.append('file', file);

        fetch('https://api.upfiles.com/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from the server
            if (data.status === 'success') {
                const getCodeBtn = document.createElement('button');
                getCodeBtn.textContent = 'Get Code';
                getCodeBtn.addEventListener('click', function () {
                    window.open(data.url, '_blank');
                });
                linkDisplay.innerHTML = `Code Link: `;
                linkDisplay.appendChild(getCodeBtn);
                linkDisplay.style.display = 'block';
            } else {
                console.error('File upload failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }
});
