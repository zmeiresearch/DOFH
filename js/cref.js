function getModule(objectFile) {
	if (objectFile.startsWith("/lib") || objectFile.startsWith("/usr/lib")) {
		return "System";
	}
		
	lastOpeningBracketIndex = objectFile.lastIndexOf("(");
	lastSlashIndex = objectFile.lastIndexOf("/");
	module = objectFile.substring(lastSlashIndex + 1, lastOpeningBracketIndex);

	if (module.startsWith("libxml") || module.startsWith("libxslt")) {
		return "libxml";
	}

	return module;
}

function getFileName(objectFile) {
	lastOpeningBracketIndex = objectFile.lastIndexOf("(");
	lastClosingBracketIndex = objectFile.lastIndexOf(")");
	fileName = objectFile.substring(lastOpeningBracketIndex + 1, lastClosingBracketIndex);
	return fileName;
}

function getNode(objectFile) {
	const blackboxLibs = ["System", "libxml", "libxslt"];
	module = getModule(objectFile);
	fileName = getFileName(objectFile);
	blackboxLibs.forEach((lib) => {
		if (module.startsWith(lib)) return module + "/" + module;
	});
		
	return module + "/" + fileName
}

function parseCref(crefText) {
	var modules = {};
	var dependencies = {}; 
	var symbolFileFound = false;
	var linesParsed = 0;
	var crefsFound = 0;
	var nodesCount = 0;
	var lastSymbol;
	var lastModule;
	var lastNode;
	
	console.log("parsing cref file");
	const crefLines = crefText.split(/\r\n|\n/);
	console.log("Found " + crefLines.length + " lines");

	crefLines.forEach((line) => { 
		// squash multiple spaces to one and split
		words = line.trim().replace( /\s\s+/g, ' ' ).split(" ");
		linesParsed++;

		if (!symbolFileFound) {
			// look for the line "Symbol	File"
			if (words.length == 2) {
				if ((words[0] == "Symbol") || (words[1] == "File")) {
					symbolFileFound = true;
				}
			}
		} else {
			if (words.length == 2) {
				// where a symbol is located
				lastSymbol = words[0];
				lastModule = getModule(words[1]);
				lastNode = getNode(words[1]);
			} else if (words.length == 1 && words[0] != "") {
				crefsFound++;
				// where from a symbol is referred to
           		// Create the module/file/symbol entry here as we need only the ones
           		// that have at least one external reference
				if (!modules.hasOwnProperty(lastModule)) {
					modules[lastModule] = {};
					console.log("Added module " + lastModule);
				}
					
				if (!modules[lastModule].hasOwnProperty(lastNode)) {
					modules[lastModule][lastNode] = {};
					console.log("Added node " + lastNode);
					nodesCount++;
				}

				currentModule = getModule(words[0]);
				currentNode = getNode(words[0]);

				if (!modules.hasOwnProperty(currentModule)) {
					modules[currentModule] = {};
					console.log("Added module " + currentModule);
				}

				if (!modules[currentModule].hasOwnProperty(currentNode)) {
					modules[currentModule][currentNode] = {};
					console.log("Added node " + currentNode);
					nodesCount++;
				}

				// dependencies[user][provider][symbol]
				var user = currentNode;
				var provider = lastNode;
				if (!dependencies.hasOwnProperty(user)) {
					dependencies[user] = {};
				}
				if (!dependencies[user].hasOwnProperty(provider)) {
					dependencies[user][provider] = [];
				}
				dependencies[user][provider].push(lastSymbol);

			} else {
				console.log("Empty line! Yay!");
			}
		}
	});

	console.log("Processed " + linesParsed + " lines");
	console.log("Found " + modules.length  + " modules");
	console.log("Containing " + nodesCount + " nodes and " + crefsFound + " cross-references");

	updateGraph(modules, dependencies);
}

function updateGraph(modules, dependencies) {
	console.log("Updating graph");
	
	// start with a clean sheat
	cy.elements().remove();

	for (let [module, nodes] of Object.entries(modules)) {
		console.log("Adding module " + module);
		cy.add({group: 'nodes', data: { id: module }})

		for (let [node] of Object.entries(nodes)) {
			console.log("Adding node " + node);
			cy.add({group: 'nodes', data: { id: node, parent: module }}); 
		}
	}

	for (let [user, providers] of Object.entries(dependencies)) {
		for (let [provider, symbols] of Object.entries(providers)) {
			symbols.forEach(symbol => {
				console.log("Adding dependency of " + user + " from " + provider + " by " + symbol);
				cy.add({group: 'edges', data :{ name:symbol, source: user, target: provider}}); 
			});
		}

	}
}


(function(){
  document.addEventListener('DOMContentLoaded', function(){
  	let $ = selector => document.querySelector( selector );	

	//let parseCref = () => Promise.resolve( $stylesheet.value ).then( getStylesheet ).then( applyStylesheet );
  	let handleFileUpload = () => { 
		files = document.getElementById("uploadButton").files;
		console.log("file uploaded: " + files[0].name + ", " + files[0].size + " bytes");

		let reader = new FileReader();
		reader.onloadend = () => {
			parseCref(reader.result);
		}
		reader.readAsText(files[0]);
		
	
		
				
	};

	$('#uploadButton').addEventListener('change', handleFileUpload, false);

  });
})();
