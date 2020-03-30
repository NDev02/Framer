<p align="center" style="background: linear-gradient(315deg, rgb(64, 92, 177), rgb(39, 60, 124));">
  <img width="300" src="/assets/Framer Logo.svg">
</p>

## Framer
A janky-ish, in-development, web-framework. I mainly developed this framework because I was bored during quarantine, but hey why not put it online 🤷‍♂️. Don't expect it to work amazingly, and definitely don't expect it to work all the time. This project is currently not in a place I would recommend for distribution... Let's call this v0.0.1 beta.

### Basics
Alright so the rules here are pretty simple. You have an application that everything is rendered (FramerApp) in and components (FramerComponents) that act as HTML elements but more manipulatable. FramerComponents extend the HTMLElement class and therefore inherit all those cool functions but you are also able to write your own and get them to work how you want with custom HTML Framer Components. Everything here is intended to be written in TypeScript (except for obviously the HTML and CSS) and everything works as modules - much like the many other web frameworks out there. Speaking of many other frameworks, there is support for JSX - hooray! 🎉 - so it is super easy to write your HTML inline with your typescript code just like you would with a framework like React.

### Setup
First and foremost, make sure you have the [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) Compiler installed on your development machine. If you have npm installed you can just run the command `npm install -g typescript`. If you have [VSCode](https://code.visualstudio.com/download) the remainder of the setup has been done for you, just download the example project and get started. In the example project you will find I have predefined two helpful VSCode snippets, cfa and cfc. cfa creates a template for a Framer Application and cfc creates a template for a Framer Component. To start developing you can use the ctrl + shift + b keyboard shortcut and choose the predefined `tsc:watch - tsconfig.json` task, which will basically start transpiling everything into JavaScript in the background and if you use the watch task it will even re-transpile your code as you save your TypeScript files automatically - nice! 👍 Also to enhance your development experience, I would recommend installing [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) from the VSCode market place, after installing Live Server open up the index.html file for the project and right click anywhere ont the code, choose open with Live Server. This will serve your project and it automatically reloads the in-development webpage whenever it detects a change in code.  

### Where's the documentation?
Documentation can currently be found in the docs folder, just open up that index.html page in a web browser - soon it will be on a github pages page along with a more in-depth tutorial. 👨‍💻

### Future Plans
I'd like to keep developing this framework to eventually be something that I'd use in production. What I really want to try to implement to sort of make this stand out among other frameworks is setup a "package manager" for custom FramerComponents so developers can quickly just pull an already developed component from the cloud and not have to reinvent the wheel - like NPM but for Framer. I also want to look in getting this to support javascript and not have to be transpiled by TypeScript, unfortunately as of right now its a hard task to achieve without losing JSX support 😒 but we shall see...
