// Default project file
let projectFile = 'light.json';

// Create a button and sidebar for theme switching
const themeSwitcherDiv = document.getElementById('theme-switcher');

// Style the themeSwitcherDiv with Bootstrap classes
themeSwitcherDiv.classList.add('position-fixed', 'top-0', 'start-0', 'm-0');
themeSwitcherDiv.style.zIndex = 10000;

const button = document.createElement('button');
button.innerHTML = '⚙️';
button.classList.add('btn', 'btn-light', 'half-pill');
button.style.borderRadius = '0 20px 20px 0';
button.style.borderColor = '#e5e5e5'
button.style.position = 'absolute';
button.style.left = '0';
button.style.top = '10px';
button.style.zIndex = 10001;
button.style.padding = '5px 20px 5px 20px'; // Adjust padding for proper icon coverage
button.style.display = 'flex';
button.style.alignItems = 'center';
button.style.justifyContent = 'center';
button.style.backgroundColor = '#e5e5e5';

const sidebar = document.createElement('div');
sidebar.classList.add('bg-white', 'shadow', 'p-3', 'position-fixed', 'top-0', 'start-0', 'h-100', 'd-none');
sidebar.style.width = '100%';
sidebar.style.maxWidth = '300px';
sidebar.style.zIndex = 9999;

// Create a back button for the sidebar
const backButton = document.createElement('button');
backButton.innerHTML = '<--- Back';
backButton.classList.add('btn', 'btn-dark', 'mb-3');

// Create sections for theme and image options
const themeSection = document.createElement('div');
themeSection.classList.add('mb-4');
const themeSectionTitle = document.createElement('h5');
themeSectionTitle.innerText = 'Theme Options';
themeSection.appendChild(themeSectionTitle);

const imageSection = document.createElement('div');
const imageSectionTitle = document.createElement('h5');
imageSectionTitle.innerText = 'Image Options';
imageSection.appendChild(imageSectionTitle);

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

// Add theme options to theme section
themeSection.appendChild(autoOption);
themeSection.appendChild(lightOption);
themeSection.appendChild(darkOption);

// Add image options to image section
imageSection.appendChild(imageOption);
imageSection.appendChild(noImageOption);

// Add sections and back button to sidebar
sidebar.appendChild(backButton);
sidebar.appendChild(themeSection);
sidebar.appendChild(imageSection);

// Add button and sidebar to the theme switcher div
themeSwitcherDiv.appendChild(button);
themeSwitcherDiv.appendChild(sidebar);

// Event listener to toggle the display of sidebar
button.addEventListener('click', () => {
    sidebar.classList.toggle('d-none');
    button.classList.toggle('d-none');
});

// Event listener for the back button
backButton.addEventListener('click', () => {
    sidebar.classList.add('d-none');
    button.classList.remove('d-none');
});

// Function to set the project file and highlight the selected option
function setProjectFile(themeName) {
    const imageEnabled = imageOption.classList.contains('bg-dark');

    if (themeName === 'auto') {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        themeName = prefersDarkScheme.matches ? 'dark.json' : 'light.json';
    }

    if (themeName === 'light.json' || themeName === 'light_noimg.json') {
        projectFile = imageEnabled ? 'light.json' : 'light_noimg.json';
    } else if (themeName === 'dark.json' || themeName === 'dark_noimg.json') {
        projectFile = imageEnabled ? 'dark.json' : 'dark_noimg.json';
    }

    document.cookie = `theme=${projectFile};path=/`;
    highlightSelectedOption();
    location.reload(); // Reload content
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
    const theme = prefersDarkScheme.matches ? 'dark.json' : 'light.json';
    setProjectFile(theme);
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

// Event listeners for theme options
autoOption.addEventListener('click', () => {
    setProjectFile('auto');
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
    setProjectFile(projectFile.includes('dark') ? 'dark.json' : 'light.json');
});

noImageOption.addEventListener('click', () => {
    noImageOption.classList.add('bg-dark', 'text-white');
    imageOption.classList.remove('bg-dark', 'text-white');
    setProjectFile(projectFile.includes('dark') ? 'dark_noimg.json' : 'light_noimg.json');
});

// Apply cookie preference or system preference on load
const themeCookie = getCookie('theme');
if (themeCookie) {
    projectFile = themeCookie;
    // Set image option based on cookie
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
