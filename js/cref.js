function getModule(objectFile) {
	if (objectFile.startsWith("/lib") || objectFile.startsWith("/usr/lib")) {
		console.log("getModule: " + objectFile + " -> System");
		return "System";
	}
		
	lastOpeningBracketIndex = objectFile.lastIndexOf("(");
	lastSlashIndex = objectFile.lastIndexOf("/");
	if (-1 == lastOpeningBracketIndex) {
		module = objectFile.substring(lastSlashIndex + 1);
	} else {
		module = objectFile.substring(lastSlashIndex + 1, lastOpeningBracketIndex);
	}

	console.log("getModule: " + objectFile + " -> " + module);

	return module;
}

function getFileName(objectFile) {
	lastOpeningBracketIndex = objectFile.lastIndexOf("(");
	lastClosingBracketIndex = objectFile.lastIndexOf(")");

	if ((-1 == lastOpeningBracketIndex) || (-1 == lastClosingBracketIndex)) {
		// probably a shared object
		fileName = objectFile.substring(objectFile.lastIndexOf("/") + 1);
	} else {
		fileName = objectFile.substring(lastOpeningBracketIndex + 1, lastClosingBracketIndex);
	}
	console.log("getFileName: " + objectFile + " -> " + fileName);
	return fileName;
}

//function getNode(objectFile) {
//	const blackboxLibs = ["System", "libxml", "libxslt"];
//	module = getModule(objectFile);
//	fileName = getFileName(objectFile);
//	node = module + "/" + fileName;
//	blackboxLibs.forEach((lib) => {
//		if (module.startsWith(lib)) {
//			node = lib + "/" + lib;
//		}
//	});
//		
//	return node;
//}

function parseCref(crefText) {
	var modules = {};
	var dependencies = {}; 
	var symbolFileFound = false;
	var linesParsed = 0;
	var crefsFound = 0;
	var nodesCount = 0;
	var lastSymbol;
	var lastModule;
	var lastFile;
	
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
				lastFile = getFileName(words[1]);
			} else if (words.length == 1 && words[0] != "") {
				crefsFound++;
				// where from a symbol is referred to
           		// Create the module/file/symbol entry here as we need only the ones
           		// that have at least one external reference
				if (!modules.hasOwnProperty(lastModule)) {
					modules[lastModule] = {};
					console.log("Added module " + lastModule);
				}
					
				if (!modules[lastModule].hasOwnProperty(lastFile)) {
					modules[lastModule][lastFile] = {};
					console.log("Added file " + lastFile);
					nodesCount++;
				}

				currentModule = getModule(words[0]);
				currentFile = getFileName(words[0]);

				if (!modules.hasOwnProperty(currentModule)) {
					modules[currentModule] = {};
					console.log("Added module " + currentModule);
				}

				if (!modules[currentModule].hasOwnProperty(currentFile)) {
					modules[currentModule][currentFile] = {};
					console.log("Added file " + currentFile);
					nodesCount++;
				}

				// dependencies[user][provider][symbol]
				var user = { module: currentModule, file: currentFile };
				var provider = { module: lastModule, file: lastFile };
				if (user != provider) {
					if (!dependencies.hasOwnProperty(lastSymbol)) {
						dependencies[lastSymbol] = [];
					}
					dependencies[lastSymbol].push({user: user, provider: provider});
				}

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

	for (let [module, files] of Object.entries(modules)) {
		console.log("Adding module " + module);
		cy.add({group: 'nodes', data: { id: module }})

		for (let [file] of Object.entries(files)) {
			if (file !== "") {
				console.log("Adding node " + module + "/" + file);
				cy.add({group: 'nodes', data: { id: module + "/" + file, parent: module }}); 
			}
		}
	}

	for (let [symbol, dependency] of Object.entries(dependencies)) {
		dependency.forEach(function (dep) {
			if (dep.user.file !== "") {
				var source = dep.user.module + "/" + dep.user.file;
			} else {
				var source = dep.user.module;
			}

			if (dep.provider.file !== "") {
				var target = dep.provider.module + "/" + dep.provider.file;
			} else {
				var target = dep.provider.module;
			}
			
			console.log("Adding dependency of " + source + " from " + target + " by " + symbol);				
			cy.add({group: 'edges', data :{ name:symbol, source: source, target: target}}); 
		});
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
