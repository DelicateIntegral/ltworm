// theme-switcher.js

// Default project file
let projectFile = 'light.json';

// Create a button and bar for theme switching
const themeSwitcherDiv = document.getElementById('theme-switcher');

// Style the themeSwitcherDiv with Bootstrap classes
themeSwitcherDiv.classList.add('position-fixed', 'top-0', 'start-0', 'm-3');
themeSwitcherDiv.style.zIndex = 10000;
const button = document.createElement('button');
button.innerHTML = '☰';
button.classList.add('btn', 'dropdown-toggle');

const themeBar = document.createElement('div');
themeBar.classList.add('dropdown-menu', 'p-2', 'bg-white', 'shadow');

// Create theme options with Bootstrap classes
const autoOption = document.createElement('button');
autoOption.innerHTML = 'Auto';
autoOption.classList.add('btn', 'btn-light', 'w-100', 'mb-1');

const lightOption = document.createElement('button');
lightOption.innerHTML = 'Light';
lightOption.classList.add('btn', 'btn-light', 'w-100', 'mb-1');

const darkOption = document.createElement('button');
darkOption.innerHTML = 'Dark';
darkOption.classList.add('btn', 'btn-light', 'w-100', 'mb-1');

// Create image toggle options
const imageOption = document.createElement('button');
imageOption.innerHTML = 'Image';
imageOption.classList.add('btn', 'btn-light', 'w-100', 'mb-1', 'bg-dark', 'text-white');

const noImageOption = document.createElement('button');
noImageOption.innerHTML = 'No Image';
noImageOption.classList.add('btn', 'btn-light', 'w-100', 'mb-1');

// Add theme and image options to theme bar
themeBar.appendChild(autoOption);
themeBar.appendChild(lightOption);
themeBar.appendChild(darkOption);
themeBar.appendChild(imageOption);
themeBar.appendChild(noImageOption);

// Add button and theme bar to the theme switcher div
themeSwitcherDiv.appendChild(button);
themeSwitcherDiv.appendChild(themeBar);

// Event listener to toggle the display of theme bar
button.addEventListener('click', () => {
    themeBar.classList.toggle('show');
});

// Function to set the project file and highlight the selected option
function setProjectFile(fileName) {
    const imageEnabled = imageOption.classList.contains('bg-dark');
    
    if (fileName === 'light.json') {
        if (imageEnabled) {
            projectFile = 'light.json';
        } else {
            projectFile = 'light_noimg.json';
        }
    } else if (fileName === 'dark.json') {
        if (imageEnabled) {
            projectFile = 'dark.json';
        } else {
            projectFile = 'dark_noimg.json';
        }
    }

    document.cookie = `theme=${projectFile};path=/`;
    highlightSelectedOption();
    updateButtonAppearance();
    location.reload(); // Reload your content or adjust as needed
}

// Function to get the value of a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to apply system appearance preference
function applySystemPreference() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    projectFile = prefersDarkScheme.matches ? 'dark.json' : 'light.json';
    setProjectFile(projectFile);
}

// Function to highlight the selected option
function highlightSelectedOption() {
    autoOption.classList.remove('bg-dark', 'text-white');
    lightOption.classList.remove('bg-dark', 'text-white');
    darkOption.classList.remove('bg-dark', 'text-white');
    
    if (projectFile === 'light.json' || projectFile === 'light_noimg.json') {
        lightOption.classList.add('bg-dark', 'text-white');
    } else if (projectFile === 'dark.json' || projectFile === 'dark_noimg.json') {
        darkOption.classList.add('bg-dark', 'text-white');
    } else {
        autoOption.classList.add('bg-dark', 'text-white');
    }
}

// Function to update the button appearance based on the selected theme
function updateButtonAppearance() {
    button.classList.remove('btn-light', 'btn-dark');
    
    if (projectFile === 'light.json' || projectFile === 'light_noimg.json') {
        button.classList.add('btn-light');
    } else if (projectFile === 'dark.json' || projectFile === 'dark_noimg.json') {
        button.classList.add('btn-dark');
    } else {
        // Default appearance when auto is selected, you can adjust it as needed
        button.classList.add('btn-light');
    }
}

// Event listeners for theme options
autoOption.addEventListener('click', () => {
    applySystemPreference();
});

lightOption.addEventListener('click', () => {
    setProjectFile('light.json');
});

darkOption.addEventListener('click', () => {
    setProjectFile('dark.json');
});

// Event listeners for image options
imageOption.addEventListener('click', () => {
    imageOption.classList.add('bg-dark', 'text-white');
    noImageOption.classList.remove('bg-dark', 'text-white');
    setProjectFile(projectFile); // Update projectFile based on current theme and image setting
});

noImageOption.addEventListener('click', () => {
    noImageOption.classList.add('bg-dark', 'text-white');
    imageOption.classList.remove('bg-dark', 'text-white');
    setProjectFile(projectFile); // Update projectFile based on current theme and image setting
});

// Apply cookie preference or system preference on load
const themeCookie = getCookie('theme');
if (themeCookie) {
    projectFile = themeCookie;
    // Set image option based on cookie, assuming 'true' for image by default
    if (projectFile.includes('_noimg')) {
        noImageOption.classList.add('bg-dark', 'text-white');
        imageOption.classList.remove('bg-dark', 'text-white');
    } else {
        imageOption.classList.add('bg-dark', 'text-white');
        noImageOption.classList.remove('bg-dark', 'text-white');
    }
} else {
    // Apply system preference if no cookie
    applySystemPreference();
}
highlightSelectedOption();
updateButtonAppearance();
