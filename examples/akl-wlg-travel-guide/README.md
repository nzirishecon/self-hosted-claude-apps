# Demonstration App: Auckland → Wellington Travel Guide

This demonstration app was created by issuing the following prompt to Anthropic's Claude AI, using the `Sonnet 4.6` model:

>Can you generate an app that displays a summary of the different ways to travel between Auckland, New Zealand and Wellington, New Zealand? I would like there to be commentary on travel cost, travel time (including time spent waiting), and environmental impact. Finally, provide recommendations and why I might consider one recommendation over another.
>
>The app will be deployed using an existing GitHub Actions pipeline. I expect there to be the following files:
>* src/App.jsx
>* src/main.jsx
>* app.config.json
>* index.html
>* package.json
>* vite.config.js
>
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
