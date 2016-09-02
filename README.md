<h1 align="center">
  Pokerbot
</h1>

![preview](https://raw.githubusercontent.com/Dtai/PokerbotWebclient/master/img/preview.png)

# Structure

This is a small introduction on how the project is structured. Detailed explanations can be found in the code documentation. This is just to get to know the project.

```
/blockly
/blockly-colors
/bundle
/css
/elements
/extra
/img
/issues
/libs
/scripts
/tutorials
/index.html
```

#####`/blockly`

This is the directory of the [Blockly](https://github.com/google/blockly) repository. The hash of the commit we use can be found below. Newer versions change the layout of the workspace a bit. The compiled files are included in `index.html`.

*2d11522c0e91860a452d393511eb5a63e2e7ecbc*

#####`/blockly-colors`

We wrote a small script to be able to edit the layout of the blockly interface in `blocks.js`. It loads a css file to be able to customize the blockly interface. For details, check the documentation in `blocks.js`. We use `custom.css` for the layout of the Blockly workspace. It should be included in `index.html`.

#####`/bundle`

Contains the documents that are given in class with guidelines on how to use the software. The main bundle is the `.docx` file.

#####`/css`

Contains the main stylesheet of the website. All styling is done here, except for some elements inside the Blockly workspace. This styling is done in `blockly-colors`. The main css file is named `stylesheet.css` and is included in `index.html`.

####`/elements`

This folder contains parts of the interface that are loaded via AJAX in the `index.html`. These are always loaded from the root of the project, so if you want to specify a path, use the one from root!

####`/extra`

Folder contains extra files that are unnecessary for the project. It contains some example Blockly configurations and a todo file.

####`/img`

Contains the images used in the project.

####`/issues`

This folder can be used to store rules that make the program slower and/or crash. We should figure out why they are doing this and we should fix this.

####`/libs`

Contains the libraries that we use for charts etc. We use this folder to seperate them from our custom scripts. The top graph uses v1.28 of the [Smoothie](http://smoothiecharts.org) library, which can be found in `Smoothie.js`. This file is edited to display the events on the graph. The pie charts are created with v1.0.2 of the [ChartJS](http://www.chartjs.org) library which can be found in `Charts.js`. Note that this is an older version and updating to a newer one might change some of the syntax.

####`/scripts`

This is where all our custom scripts are located. These are all included in `index.html`. Check the bottom of the index for more information.

######`/scripts/blockly`

The scripts `BlocksPoker.js`, `GeneratorProlog.js` and `Scope.js` are used to create the Blockly blocks, as well as rendering the Prolog output of the workspace. These are custom made but follow the guidelines of the [Blockly](https://github.com/google/blockly) library.

######`/scripts/controllers`

Here you can find controllers for all the views. The idea here is pretty straightforward:

- `ViewController.js` handles callbacks of buttons from the UI.
- `UIHandler.js` can be used to define complex UI functions and can be called from the ViewController. For example the ViewController handles the callback that the signin button is pressed. It uses the SESSION (see `/scripts/model`) to register a new user. On success, it calls the UIHandler to update all the views and show the graphs.
- `TutorialController.js` is used to define the sequence of chapters in the Tutorial. It loads the next chapter when needed etc. See documentation for more info.

######`/scripts/model`

Within the `scripts` folder, you can find the `model`. The files in here are used to hold information about the session and communicate with the server. Only `Server.js` and `Session.js` should be used, as `ServerCore.js` is used by these two. For more information about their interface, check the documentation in the source code. Files in the model should be included in `index.html`. `ServerCore.js` is the only script that should actually send requests to the server. The implementation and interface of the server can be found [here](https://github.com/Dtai/Webserver).


######`/scripts/utils`

The scripts are used to export calculations, comparisons and constants from other files. It should be clear what these do. To edit the colorscheme of the graphs, just edit the `Colors.js` file in the `utils` folder.

####`/tutorials`

Used to store chapters for the tutorials. These are independent from each other and can be added to the tutorial in `TutorialController.js`.
