# Demonstration App: Wellington Weather Explorer

This demonstration app was created by issuing the following prompt to Anthropic's Claude AI, using the `Sonnet 4.6` model:

>Can you generate an app that displays data about weather in Wellington Central, Wellington, New Zealand over the time period of April 2025 to March 2026. Cover the following:
>1. Min, max and average rainfall.
>2. Min, max and average windspeed.
>3. Min, max and average temperature.
>Use MetService as a source of information as much as possible. Include a summary that provides commentary on trends that might be of interest to people that want to explore the outdoors in Wellington as well.
>
>The app will be deployed using an existing GitHub Actions pipeline. I expect there to be the following files:
>* src/App.jsx
>* src/main.jsx
>* app.config.json
>* index.html
>* package.json
>* vite.config.js
>The app will be accessed from a landing page where a collection of tiles summarise multiple apps. Each app is contained in its own directory in a single repository.
>The schema for the `app.config.json` file is:
>
>```
>{
>  "name": "Name of the app.",
>  "description": "A short description of the app, adding a note that commentary has been made by AI.",
>  "icon": "An icon for the app.",
>  "category": "A category tag for the app.",
>  "updated": "When the statistics behind the app were last updated."
>}
>```
