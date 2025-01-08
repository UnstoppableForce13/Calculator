let darkMode = false;

// Toggle between light and dark modes
document.getElementById('theme-toggle').onclick = function () {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
};

// Append value to display input
function appendValue(value) {
    let display = document.getElementById('display-input');
    display.value += value;
}

// Clear the display
function clearDisplay() {
    document.getElementById('display-input').value = '';
}

// Perform calculation
function calculate() {
    let input = document.getElementById('display-input').value;
    try {
        let result = eval(input);
        document.getElementById('display-input').value = result;
    } catch (error) {
        document.getElementById('display-input').value = 'Error';
    }
}

// Graphing functionality using Plotly
function showGraph() {
    let input = document.getElementById('display-input').value;
    if (!input) {
        alert('Please enter a valid mathematical expression');
        return;
    }

    try {
        // Example: Plotting y = x^2
        let x_vals = [];
        let y_vals = [];
        for (let x = -10; x <= 10; x++) {
            x_vals.push(x);
            y_vals.push(eval(input.replace('x', x))); // Replace x in input expression
        }

        let data = [{
            x: x_vals,
            y: y_vals,
            type: 'scatter'
        }];

        Plotly.newPlot('graph-container', data);
    } catch (error) {
        alert('Graphing error: ' + error.message);
    }
}

// Convert units (Example: Length conversion)
function convertUnits() {
    let input = document.getElementById('display-input').value;
    let parts = input.split(' ');
    
    if (parts.length !== 3) {
        alert('Invalid unit conversion format. Example: "10 km to miles"');
        return;
    }

    let value = parseFloat(parts[0]);
    let fromUnit = parts[1].toLowerCase();
    let toUnit = parts[2].toLowerCase();
    let conversionFactor = 0;

    // Example: Conversion from km to miles
    if (fromUnit === 'km' && toUnit === 'miles') {
        conversionFactor = 0.621371; // 1 km = 0.621371 miles
    } else if (fromUnit === 'miles' && toUnit === 'km') {
        conversionFactor = 1.60934; // 1 mile = 1.60934 km
    }

    if (conversionFactor === 0) {
        alert('Conversion not supported for these units.');
        return;
    }

    let result = value * conversionFactor;
    document.getElementById('display-input').value = result + ' ' + toUnit;
}

// Voice Command Integration (Web Speech API)
function startVoiceCommand() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }

    let recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function (event) {
        let transcript = event.results[event.results.length - 1][0].transcript;
        document.getElementById('display-input').value = transcript;
        calculate(); // Automatically calculate after voice input
    };

    recognition.onerror = function (event) {
        alert('Error with speech recognition: ' + event.error);
    };

    recognition.start();
}

// Natural Language Processing (NLP) to process commands
function processNaturalLanguage() {
    let input = document.getElementById('display-input').value.toLowerCase();

    if (input.includes('square root')) {
        let number = parseFloat(input.split('square root')[1]);
        document.getElementById('display-input').value = Math.sqrt(number);
    } else if (input.includes('power')) {
        let parts = input.split('power');
        let base = parseFloat(parts[0].trim());
        let exponent = parseFloat(parts[1].trim());
        document.getElementById('display-input').value = Math.pow(base, exponent);
    } else if (input.includes('add')) {
        let numbers = input.split('add').map(num => parseFloat(num.trim()));
        document.getElementById('display-input').value = numbers.reduce((a, b) => a + b, 0);
    } else {
        // Default case: try evaluating as a regular expression
        calculate();
    }
}

// Advanced error handling
function validateInput(input) {
    let regex = /^[0-9+\-*/().\s]*$/;
    return regex.test(input);
}

// Event Listener for natural language processing input (optional)
document.getElementById('display-input').addEventListener('input', function () {
    let input = document.getElementById('display-input').value;

    if (!validateInput(input)) {
        alert('Invalid characters in input!');
        document.getElementById('display-input').value = input.slice(0, -1); // Remove last invalid character
    }
});

// Listen for a key press (for keyboard shortcuts like "Enter")
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        calculate();
    }
});
