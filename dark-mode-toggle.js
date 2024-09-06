/**
 * Dark Mode Toggle 1.0.1 (Modified for Default Dark Mode)
 * This version forces dark mode by default and handles toggling with aria-pressed attribute.
 */

function colorModeToggle() {
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  const htmlElement = document.documentElement;
  const computed = getComputedStyle(htmlElement);
  let toggleEl;
  let togglePressed = "false";  // Default aria-pressed to false

  const scriptTag = document.querySelector("[tr-color-vars]");
  if (!scriptTag) {
    console.warn("Script tag with tr-color-vars attribute not found");
    return;
  }

  let colorModeDuration = attr(0.5, scriptTag.getAttribute("duration"));
  let colorModeEase = attr("power1.out", scriptTag.getAttribute("ease"));

  const cssVariables = scriptTag.getAttribute("tr-color-vars");
  if (!cssVariables.length) {
    console.warn("Value of tr-color-vars attribute not found");
    return;
  }

  let lightColors = {};
  let darkColors = {};
  cssVariables.split(",").forEach(function (item) {
    let lightValue = computed.getPropertyValue(`--color--${item}`);
    let darkValue = computed.getPropertyValue(`--dark--${item}`);
    if (lightValue.length) {
      if (!darkValue.length) darkValue = lightValue;
      lightColors[`--color--${item}`] = lightValue;
      darkColors[`--color--${item}`] = darkValue;
    }
  });

  if (!Object.keys(lightColors).length) {
    console.warn("No variables found matching tr-color-vars attribute value");
    return;
  }

  // Function to apply dark or light mode
  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && animate) {
      gsap.to(htmlElement, {
        ...colorObject,
        duration: colorModeDuration,
        ease: colorModeEase
      });
    } else {
      Object.keys(colorObject).forEach(function (key) {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  // Function to toggle between dark and light mode
  function goDark(dark, animate) {
    if (dark) {
      localStorage.setItem("dark-mode", "true");
      htmlElement.classList.add("dark-mode");
      setColors(darkColors, animate);
      togglePressed = "true";  // Set aria-pressed to true for dark mode
    } else {
      localStorage.setItem("dark-mode", "false");
      htmlElement.classList.remove("dark-mode");
      setColors(lightColors, animate);
      togglePressed = "false";  // Set aria-pressed to false for light mode
    }

    // Update aria-pressed attribute for each toggle button
    if (typeof toggleEl !== "undefined") {
      toggleEl.forEach(function (element) {
        element.setAttribute("aria-pressed", togglePressed);
      });
    }
  }

  // Check user's saved preference from localStorage
  let storagePreference = localStorage.getItem("dark-mode");

  // Default to dark mode if no preference is found
  if (storagePreference === null) {
    goDark(true, false);  // Force dark mode by default
  } else {
    // Apply the user's stored preference
    storagePreference === "true" ? goDark(true, false) : goDark(false, false);
  }

  // Add event listener to toggle button
  window.addEventListener("DOMContentLoaded", (event) => {
    toggleEl = document.querySelectorAll("[tr-color-toggle]");
    toggleEl.forEach(function (element) {
      element.setAttribute("aria-label", "Toggle Dark/Light Mode");
      element.setAttribute("role", "button");
      element.setAttribute("aria-pressed", togglePressed);
    });

    // Toggle between dark and light modes on button click
    toggleEl.forEach(function (element) {
      element.addEventListener("click", function () {
        let darkClass = htmlElement.classList.contains("dark-mode");
        darkClass ? goDark(false, true) : goDark(true, true);
      });
    });
  });
}

colorModeToggle();

document.addEventListener("DOMContentLoaded", function () {
    const htmlElement = document.documentElement;
    const titleElement = document.getElementById("item-title");  // Target the title element by ID
    let toggleEl;

    // Function to change the title color based on dark/light mode
    function setTitleColor(isDarkMode) {
        if (titleElement) {
            if (isDarkMode) {
                titleElement.style.color = "#FFFFFF";  // White for dark mode
                console.log("Dark mode - Title color changed to white");
            } else {
                titleElement.style.color = "#000000";  // Black for light mode
                console.log("Light mode - Title color changed to black");
            }
        } else {
            console.warn("Title element not found!");
        }
    }

    // Function to continuously check and force the correct title color
    function enforceTitleColor() {
        const isDarkMode = htmlElement.classList.contains("dark-mode");
        setTitleColor(isDarkMode);  // Set the correct title color based on the current mode
        console.log("Checking and enforcing title color...");  // Log every time the check is made
    }

    // Run the title color enforcement every 500 milliseconds (adjust as needed)
    setInterval(enforceTitleColor, 500);

    // Function to toggle between dark and light mode
    function goDark(dark, animate) {
        if (dark) {
            localStorage.setItem("dark-mode", "true");
            htmlElement.classList.add("dark-mode");
            setColors(darkColors, animate);  // Apply dark mode colors
            setTitleColor(true);  // Apply dark mode color to the title
            console.log("Switched to dark mode");
        } else {
            localStorage.setItem("dark-mode", "false");
            htmlElement.classList.remove("dark-mode");
            setColors(lightColors, animate);  // Apply light mode colors
            setTitleColor(false);  // Apply light mode color to the title
            console.log("Switched to light mode");
        }

        if (toggleEl) {
            toggleEl.forEach(function (element) {
                element.setAttribute("aria-pressed", dark ? "true" : "false");
            });
        }
    }

    // Check user's saved preference from localStorage
    let darkModePreference = localStorage.getItem("dark-mode");

    // Default to dark mode if no preference is found
    if (darkModePreference === null) {
        goDark(true, false);  // Default to dark mode
    } else {
        goDark(darkModePreference === "true", false);
    }

    // Add event listener for the toggle button to switch modes
    window.addEventListener("DOMContentLoaded", (event) => {
        toggleEl = document.querySelectorAll("[tr-color-toggle]");
        toggleEl.forEach(function (element) {
            element.setAttribute("aria-label", "Toggle Dark/Light Mode");
            element.setAttribute("role", "button");

            element.addEventListener("click", function () {
                const isDarkMode = htmlElement.classList.contains("dark-mode");
                goDark(!isDarkMode, true);  // Toggle between modes and apply the correct colors
            });
        });
    });
});

