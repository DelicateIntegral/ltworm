// // Default project file
let projectFile = "dark.json";

(function () {
  // variables
  let savedBuilds = [];
  let dark = "dark.json";
  let light = "light.json";
  let dark_noimg = "dark_noimg.json";
  let light_noimg = "light_noimg.json";

  // Function for loading indicator
  function loadIndicator() {
    const indicator = document.getElementById("indicator");
    const app = document.getElementById("app");
    indicator.style.display = "block";

    let _XHR = XMLHttpRequest;
    XMLHttpRequest = class XHR extends _XHR {
      constructor() {
        super();

        let _open = this.open;
        this.open = (...args) => {
          if (
            `${args[0]}`.toUpperCase() === "GET" &&
            `${args[1]}`.match(
              /^(project|dark|light|dark_noimg|light_noimg)\.json$/
            )
          ) {
            this.addEventListener("progress", (e) => {
              const percentComplete = !e.total
                ? `${((100 * e.loaded) / 100000000).toFixed(1)}%`
                : `${((100 * e.loaded) / e.total).toFixed(1)}%`;
              indicator.innerHTML = `<p>Loading ${percentComplete}</p>`;
              app.style.display = "none";
            });
            this.addEventListener("loadend", () => {
              indicator.innerHTML = "Loading 100.0%";
              setTimeout(() => {
                indicator.style.display = "none";
                app.style.display = "block";
              }, 100);
            });
          }
          return _open.apply(this, args);
        };
      }
    };
  }

  // Function to set the project file and highlight the selected option
  function setProjectFile(themeName) {
    loadIndicator();

    const imageEnabled = imageOption.classList.contains("bg-dark");

    if (themeName === "auto") {
      const prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      themeName = prefersDarkScheme.matches ? dark : light;
    }

    if (themeName === light || themeName === light_noimg) {
      projectFile = imageEnabled ? light : light_noimg;
    } else if (themeName === dark || themeName === dark_noimg) {
      projectFile = imageEnabled ? dark : dark_noimg;
    }

    setCookie("theme", projectFile, 30);
    highlightSelectedOption();
    updateButtonAppearance();
    location.reload(); // Reload content
  }

  // Set a cookie
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/;";
  }

  // Function to get the value of a cookie by name
  function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(nameEQ));
    return cookies ? cookies.substring(nameEQ.length) : null;
  }

  // Function to apply system appearance preference
  function applySystemPreference() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const theme = prefersDarkScheme.matches ? dark : light;
    setProjectFile(theme);
  }

  // Function to update the button appearance based on the selected theme
  function updateButtonAppearance() {
    button.classList.remove("btn-light", "btn-dark");
    if (projectFile === light || projectFile === light_noimg) {
      button.classList.add("btn-dark");
    } else if (projectFile === dark || projectFile === dark_noimg) {
      button.classList.add("btn-light");
    }
  }

  // Function to highlight the selected option
  function highlightSelectedOption() {
    autoOption.classList.remove("bg-dark", "text-white");
    lightOption.classList.remove("bg-dark", "text-white");
    darkOption.classList.remove("bg-dark", "text-white");

    if (projectFile === light || projectFile === light_noimg) {
      lightOption.classList.add("bg-dark", "text-white");
    } else if (projectFile === dark || projectFile === dark_noimg) {
      darkOption.classList.add("bg-dark", "text-white");
    } else {
      autoOption.classList.add("bg-dark", "text-white");
    }
  }

  function setTheme() {
    // Apply cookie preference or system preference on load
    const themeCookie = getCookie("theme");
    if (themeCookie) {
      projectFile = themeCookie;
      // Set image option based on cookie
      if (projectFile.includes("_noimg")) {
        noImageOption.classList.add("bg-dark", "text-white");
        imageOption.classList.remove("bg-dark", "text-white");
      } else {
        imageOption.classList.add("bg-dark", "text-white");
        noImageOption.classList.remove("bg-dark", "text-white");
      }
    } else {
      // Apply system preference if no cookie
      applySystemPreference();
    }
  }

  // Function to store a list in localStorage
  function storeList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error("Error storing list in localStorage", e);
    }
  }

  // Function to retrieve a list from localStorage
  function retrieveList(key, defaultValue = []) {
    try {
      const listString = localStorage.getItem(key);
      return listString ? JSON.parse(listString) : defaultValue;
    } catch (e) {
      console.error("Error retrieving list from localStorage", e);
      return defaultValue;
    }
  }

  // Function to remove list from localStorage
  function removeList(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Error removing list from localStorage", e);
    }
  }

  function saveBuildToLocalStorage(buildName) {
    const activated = document.getElementById("");
    storeList(buildName, activated);
  }

  function loadBuildFromLocalStorage(buildName) {
    app.__vue__.$store.state.app.activated = retrieveList(buildName);
  }

  function removeBuildFromLocalStorage(buildName) {
    removeList(buildName);
  }

  // Function to update the UI with saved builds
  function updateSavedBuildsUI() {
    savedBuildsList.innerHTML = ""; // Clear previous content

    savedBuilds.forEach((build, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("mb-2", "d-flex");

      // Build name span
      const buildName = document.createElement("p");
      buildName.innerText = index + 1 + ": " + build.name;
      buildName.style.width = "120px";
      buildName.style.border = "solid";
      buildName.style.borderWidth = "0px";
      listItem.appendChild(buildName);

      // Load button
      const loadButton = document.createElement("button");
      loadButton.innerHTML = `<span class="material-symbols-outlined">folder_open</span>`;
      loadButton.style.width = "25px";
      loadButton.style.height = "25px";
      loadButton.style.display = "flex";
      loadButton.style.alignItems = "center";
      loadButton.style.justifyContent = "center";
      loadButton.style.margin = "0px 5px 0px 0px";
      loadButton.style.padding = "7.5px 15px";
      loadButton.addEventListener("click", () => {
        loadBuild(build.name);
      });
      listItem.appendChild(loadButton);

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = `<span class="material-symbols-outlined">delete_forever</span>`;
      deleteButton.style.width = "25px";
      deleteButton.style.height = "25px";
      deleteButton.style.display = "flex";
      deleteButton.style.alignItems = "center";
      deleteButton.style.justifyContent = "center";
      deleteButton.style.padding = "7.5px 15px";
      deleteButton.addEventListener("click", () => {
        deleteBuild(index);
      });
      listItem.appendChild(deleteButton);

      savedBuildsList.appendChild(listItem);
    });
  }

  // Function to load a build (just a placeholder function)
  function loadBuild(buildName) {
    console.log(`Loading build: ${buildName}`);
    // Add your logic here to load the build
  }

  // Function to delete a build
  function deleteBuild(index) {
    savedBuilds.splice(index, 1);
    updateSavedBuildsUI();
  }

  // Function to save the build
  function saveBuild() {
    const buildName = buildNameInput.value.trim();

    if (buildName === "") {
      alert("Please enter a build name.");
      return;
    }

    // Check if buildName already exists
    const existingBuild = savedBuilds.find((build) => build.name === buildName);
    if (existingBuild) {
      alert("This build name already exists. Please use a different name.");
      return;
    }

    // Create a new build object and add it to savedBuilds
    const newBuild = { name: buildName };
    savedBuilds.push(newBuild);

    // Update the UI to display the saved builds
    updateSavedBuildsUI();

    // Clear the input field
    buildNameInput.value = "";
  }

  // Get settings element
  const settingsDiv = document.getElementById("settings");

  // Style the settingsDiv with Bootstrap classes
  settingsDiv.classList.add("position-fixed", "top-0", "start-0", "m-0");
  settingsDiv.style.zIndex = 10000;

  // Create button element to toggle settings
  const button = document.createElement("button");
  button.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px">settings</span>`;
  button.classList.add("btn", "btn-light", "half-pill");
  button.style.borderRadius = "0 20px 20px 0";
  button.style.position = "absolute";
  button.style.left = "0";
  button.style.top = "10px";
  button.style.zIndex = 10001;
  button.style.padding = "3px 20px";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";

  // Event listener to toggle the display of sidebar
  button.addEventListener("click", () => {
    sidebar.classList.toggle("d-none");
    button.classList.toggle("d-none");
  });

  // Create sidebar to show settings
  const sidebar = document.createElement("div");
  sidebar.classList.add(
    "bg-white",
    "shadow",
    "p-3",
    "position-fixed",
    "top-0",
    "start-0",
    "h-100",
    "d-none"
  );
  sidebar.style.width = "100%";
  sidebar.style.maxWidth = "200px";
  sidebar.style.zIndex = 9999;
  sidebar.style.boxShadow = "4px 0 8px rgba(0, 0, 0, 0.5)";
  sidebar.style.overflowY = "auto";

  // Create a back button to close the sidebar
  const backButton = document.createElement("button");
  backButton.innerHTML = `<span class="material-symbols-outlined">keyboard_backspace</span>`;
  backButton.classList.add("btn", "btn-dark", "mb-3");
  backButton.style.display = "flex";
  backButton.style.alignItems = "center";
  backButton.style.justifyContent = "center";
  sidebar.appendChild(backButton);

  backButton.addEventListener("click", () => {
    sidebar.classList.add("d-none");
    button.classList.remove("d-none");
  });

  // Create section for theme options
  const themeSection = document.createElement("div");
  themeSection.classList.add("mb-4");
  const themeSectionTitle = document.createElement("h5");
  themeSectionTitle.innerText = "Theme Options";
  themeSection.appendChild(themeSectionTitle);

  const autoOption = document.createElement("button");
  autoOption.innerHTML = "Auto";
  autoOption.classList.add("btn", "btn-light", "w-100", "mb-1");

  const lightOption = document.createElement("button");
  lightOption.innerHTML = "Light";
  lightOption.classList.add("btn", "btn-light", "w-100", "mb-1");

  const darkOption = document.createElement("button");
  darkOption.innerHTML = "Dark";
  darkOption.classList.add("btn", "btn-light", "w-100", "mb-1");

  themeSection.appendChild(autoOption);
  themeSection.appendChild(lightOption);
  themeSection.appendChild(darkOption);
  sidebar.appendChild(themeSection);

  autoOption.addEventListener("click", () => {
    setProjectFile("auto");
  });

  lightOption.addEventListener("click", () => {
    setProjectFile(light);
  });

  darkOption.addEventListener("click", () => {
    setProjectFile(dark);
  });

  // Create section for image options
  const imageSection = document.createElement("div");
  const imageSectionTitle = document.createElement("h5");
  imageSectionTitle.innerText = "Image Options";
  imageSection.appendChild(imageSectionTitle);

  const imageOption = document.createElement("button");
  imageOption.innerHTML = "Image";
  imageOption.classList.add(
    "btn",
    "btn-light",
    "w-100",
    "mb-1",
    "bg-dark",
    "text-white"
  );

  const noImageOption = document.createElement("button");
  noImageOption.innerHTML = "No Image";
  noImageOption.classList.add("btn", "btn-light", "w-100", "mb-1");

  imageSection.appendChild(imageOption);
  imageSection.appendChild(noImageOption);
  sidebar.appendChild(imageSection);

  imageOption.addEventListener("click", () => {
    imageOption.classList.add("bg-dark", "text-white");
    noImageOption.classList.remove("bg-dark", "text-white");
    setProjectFile(projectFile.includes("dark") ? dark : light);
  });

  noImageOption.addEventListener("click", () => {
    noImageOption.classList.add("bg-dark", "text-white");
    imageOption.classList.remove("bg-dark", "text-white");
    setProjectFile(projectFile.includes("dark") ? dark_noimg : light_noimg);
  });

  // Create section for Build Options
  const buildSection = document.createElement("div");
  const buildTitle = document.createElement("h5");
  buildTitle.innerText = "Build Options";
  buildSection.appendChild(buildTitle);

  const inputButtonContainer = document.createElement("div");
  inputButtonContainer.classList.add(
    "d-flex",
    "align-items-center",
    "mb-2",
    "w-100"
  );

  const buildNameInput = document.createElement("input");
  buildNameInput.setAttribute("type", "text");
  buildNameInput.setAttribute("placeholder", "max 5 chars");
  buildNameInput.setAttribute("maxlength", "5");
  buildNameInput.classList.add("form-control");
  buildNameInput.style.width = "125px";
  buildNameInput.style.margin = "0px 10px 0px 0px";
  buildNameInput.style.fontSize = "0.75em";

  const saveBuildButton = document.createElement("button");
  saveBuildButton.innerHTML = `<span class="material-symbols-outlined">save</span>`;
  saveBuildButton.style.width = "20px";
  saveBuildButton.style.display = "flex";
  saveBuildButton.style.alignItems = "center";
  saveBuildButton.style.justifyContent = "center";
  saveBuildButton.style.left = "10px";
  saveBuildButton.style.padding = "7.5px 15px";

  inputButtonContainer.appendChild(buildNameInput);
  inputButtonContainer.appendChild(saveBuildButton);

  const savedBuildsTitle = document.createElement("h5");
  savedBuildsTitle.innerText = "Saved Builds";
  const savedBuildsList = document.createElement("ol");

  buildSection.appendChild(inputButtonContainer);
  buildSection.appendChild(savedBuildsTitle);
  buildSection.appendChild(savedBuildsList);
  buildSection.style.marginTop = "20px";
  sidebar.appendChild(buildSection);

  saveBuildButton.addEventListener("click", saveBuild);

  // Add sidebar to the theme switcher div
  settingsDiv.appendChild(button);
  settingsDiv.appendChild(sidebar);

  // initialize everything
  setTheme();
  highlightSelectedOption();
  updateButtonAppearance();
})();
