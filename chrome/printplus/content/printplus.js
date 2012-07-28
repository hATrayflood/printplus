var printplus = {
	print: function(type){
		if(!this.pref){
			this.pref = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefBranch);
		}

		var outputFormat;
		var pickerDescription;
		if(type == "pdf"){
			outputFormat = Components.interfaces.nsIPrintSettings.kOutputFormatPDF;
			pickerDescription = "Portable Document Format";
		}
		if(type == "ps"){
			outputFormat = Components.interfaces.nsIPrintSettings.kOutputFormatPS;
			pickerDescription = "PostScript";
		}

		var picker = Components.classes["@mozilla.org/filepicker;1"]
			.createInstance(Components.interfaces.nsIFilePicker);
		picker.init(window, null, Components.interfaces.nsIFilePicker.modeSave);
		picker.appendFilter(pickerDescription, "*." + type);
		picker.defaultExtension = type;
		picker.defaultString = this.getSaveFileName() + "." + type;
		if(picker.show() == Components.interfaces.nsIFilePicker.returnCancel){
			return;
		}

		var webBrowserPrint = window.content.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIWebBrowserPrint);
		var PSSVC = Components.classes["@mozilla.org/gfx/printsettings-service;1"]
			.getService(Components.interfaces.nsIPrintSettingsService);

		var printSettings = PSSVC.newPrintSettings;
		var printerName = "";
		try{
			printerName = "printer_" + PSSVC.defaultPrinterName.replace(" ", "_", "g");
		}
		catch(e){
			this.log("printplus.print(): PSSVC.defaultPrinterName " + e);
		}
		this.log("printplus.print(): printerName = " + printerName + ", outputFormat = " + type);

		this.setEdge(printerName, printSettings);
		this.setMargin(printerName, printSettings);
		this.setUnwriteableMargin(printerName, printSettings);
		this.setHeader(printerName, printSettings);
		this.setFooter(printerName, printSettings);
		//this.setPaper(printerName, printSettings);
		this.setOtherAttribute(printerName, printSettings);
		this.setOtherAttribute2(printerName, printSettings);

		printSettings.printToFile = true;
		printSettings.toFileName  = picker.file.path;
		printSettings.printSilent = true;
		printSettings.outputFormat = outputFormat;

		webBrowserPrint.print(printSettings, null);
	}
	,
	getSaveFileName: function(){
		if(window.content.document.title){
			return window.content.document.title;
		}
		else{
			var href = window.content.document.location.href;
			var slash = href.lastIndexOf("/");
			var comma = href.lastIndexOf(".");
			var length = comma - slash;
			if(slash == href.length - 1){
				slash = href.lastIndexOf("/", slash - 1);
				length = href.length - slash - 1;
			}
			else if(comma < slash){
				length = href.length - slash;
			}
			return href.substr(slash + 1, length - 1);
		}
	}
	,
	setEdge: function(printerName, printSettings){
		try{
			var key = printerName + ".print_edge_";
			printSettings.edgeTop    = this.pref.getIntPref(key + "top");
			printSettings.edgeLeft   = this.pref.getIntPref(key + "left");
			printSettings.edgeBottom = this.pref.getIntPref(key + "bottom");
			printSettings.edgeRight  = this.pref.getIntPref(key + "right");
		}
		catch(e){
			this.log("printplus.setEdge(): " + e);
		}
	}
	,
	setMargin: function(printerName, printSettings){
		try{
			var key = printerName + ".print_margin_";
			printSettings.marginTop    = this.pref.getCharPref(key + "top");
			printSettings.marginLeft   = this.pref.getCharPref(key + "left");
			printSettings.marginBottom = this.pref.getCharPref(key + "bottom");
			printSettings.marginRight  = this.pref.getCharPref(key + "right");
		}
		catch(e){
			this.log("printplus.setMargin(): " + e);
		}
	}
	,
	setUnwriteableMargin: function(printerName, printSettings){
		try{
			var key = printerName + ".print_unwriteable_margin_";
			printSettings.unwriteableMarginTop    = this.pref.getIntPref(key + "top");
			printSettings.unwriteableMarginLeft   = this.pref.getIntPref(key + "left");
			printSettings.unwriteableMarginBottom = this.pref.getIntPref(key + "bottom");
			printSettings.unwriteableMarginRight  = this.pref.getIntPref(key + "right");
		}
		catch(e){
			this.log("printplus.setUnwriteableMargin(): " + e);
		}
	}
	,
	setHeader: function(printerName, printSettings){
		try{
			var key = printerName + ".print_header";
			printSettings.headerStrLeft   = this.pref.getCharPref(key + "left");
			printSettings.headerStrCenter = this.pref.getCharPref(key + "center");
			printSettings.headerStrRight  = this.pref.getCharPref(key + "right");
		}
		catch(e){
			this.log("printplus.setHeader(): " + e);
		}
	}
	,
	setFooter: function(printerName, printSettings){
		try{
			var key = printerName + ".print_footer";
			printSettings.footerStrLeft   = this.pref.getCharPref(key + "left");
			printSettings.footerStrCenter = this.pref.getCharPref(key + "center");
			printSettings.footerStrRight  = this.pref.getCharPref(key + "right");
		}
		catch(e){
			this.log("printplus.setFooter(): " + e);
		}
	}
	,
	setPaper: function(printerName, printSettings){
		try{
			var key = printerName + ".print_paper_";
			printSettings.paperSizeType = this.pref.getIntPref (key + "size_type");
			printSettings.paperData     = this.pref.getIntPref (key + "data");
			printSettings.paperWidth    = this.pref.getCharPref(key + "width");
			printSettings.paperHeight   = this.pref.getCharPref(key + "height");
			//printSettings.paperSizeUnit = this.pref.getIntPref (key + "size_unit");
		}
		catch(e){
			this.log("printplus.setPaper(): " + e);
		}
	}
	,
	setOtherAttribute: function(printerName, printSettings){
		try{
			var key = printerName + ".print_";
			printSettings.scaling       = this.pref.getCharPref(key + "scaling");
			printSettings.printBGColors = this.pref.getBoolPref(key + "bgcolor");
			printSettings.printBGImages = this.pref.getBoolPref(key + "bgimages");
			printSettings.shrinkToFit   = this.pref.getBoolPref(key + "shrink_to_fit");
			printSettings.printReversed = this.pref.getBoolPref(key + "reversed");
			printSettings.printInColor  = this.pref.getBoolPref(key + "in_color");
			printSettings.orientation   = this.pref.getIntPref (key + "orientation");
		}
		catch(e){
			this.log("printplus.setOtherAttribute(): " + e);
		}
	}
	,
	setOtherAttribute2: function(printerName, printSettings){
		try{
			var key = printerName + ".print_";
			printSettings.downloadFonts  = this.pref.getBoolPref(key + "downloadfonts");
			printSettings.printCommand   = this.pref.getCharPref(key + "command");
			printSettings.printPageDelay = this.pref.getIntPref (key + "pagedelay");
		}
		catch(e){
			this.log("printplus.setOtherAttribute2(): " + e);
		}
	}
	,
	log: function(s){
		if(!this.console){
			this.console = Components.classes["@mozilla.org/consoleservice;1"]
				.getService(Components.interfaces.nsIConsoleService);
			this.debug = this.pref.getBoolPref("javascript.options.showInConsole");
		}
		if(this.debug){
			this.console.logStringMessage(s);
		}
	}
};
