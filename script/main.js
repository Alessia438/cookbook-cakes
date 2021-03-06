function changeCSS(cssFile) { //aggiungere come parametro d'ingresso il documento corrente
    	for (var i = 0; i < document.getElementsByTagName("iframe").length; i++) {
		var frameHead = document.getElementsByTagName("iframe")[i].contentWindow.document.head,
		frameBody = document.getElementsByTagName("iframe")[i].contentWindow.document.body,
    		allLinks = frameHead.getElementsByTagName("link"),
    		found=false;
		if (i=== 1){cssFile='../'+cssFile;}
    		for (var l=0; l<allLinks.length; l++) {
			if (allLinks[l].rel == "stylesheet") {
				found=true; 
				if (allLinks[l].href.includes('Liberty.css') && i>0){
					frameBody.querySelector('[id^="FIGURE-1-"]').remove();
					var oldImg = frameBody.querySelector('[id^="originalImage: "]');
					oldImg.id = oldImg.id.split(' ')[1];
					oldImg.style.display = 'block';
				}
				if (allLinks[l].href.includes('1980.css') || allLinks[l].href.includes('Liberty.css') && i>0){ 
					var allBylines = frameBody.getElementsByClassName('byline');
					for (var el= 0; el<allBylines.length; el++){
						if (!allBylines[el].id.includes('originalByline')){
							document.getElementsByTagName("iframe")[i].contentWindow.document.getElementById(allBylines[el].id).remove();
							el--;
						}
					}
					for (var el= 0; el<allBylines.length; el++){
						allBylines[el].id = allBylines[el].id.split(' ')[1];
						allBylines[el].style.display = 'block';
					}
				}
				allLinks[l].href = cssFile; 
				break;
			}
		}
    		if (found === false) {
			var newlink = document.createElement("link");
			newlink.rel = "stylesheet"; 
			newlink.type = "text/css";
			newlink.href = cssFile;
			frameHead.appendChild(newlink);
		}
		if (i>0 && document.getElementsByTagName("iframe")[i].contentWindow.document.body.getElementsByTagName('section').length<1){addSectionToDom(i);}
		if (cssFile.includes('Liberty.css') && i>0){liberty(i);}
		else if (cssFile.includes('1980.css') && i>0){my1980(i);} 
	}
	sessionStorage.setItem("curCSS", cssFile.replace('../', ''));
}

function verifyCSS(){
	if (sessionStorage.getItem("curCSS") !== null) {
		changeCSS(sessionStorage.getItem("curCSS"));
	}
}

function addSectionToDom(i){
	var elArray = ['h1','subtitle', 'byline', 'FIGURE-1-', 'publicationDate', 'publicationTime', 'lastModification'];
	var newSec = document.createElement('section');
	for (var el of elArray){
		if (el == 'h1'){newSec.appendChild( document.getElementsByTagName("iframe")[i].contentWindow.document.body.getElementsByTagName(el)[0]);}
		else if (el == 'FIGURE-1-'){newSec.appendChild(document.getElementsByTagName("iframe")[i].contentWindow.document.body.querySelector('[id^="FIGURE-1-"]'));} 
		else{while (document.getElementsByTagName("iframe")[i].contentWindow.document.body.getElementsByClassName(el).length>0) {
				newSec.appendChild(document.getElementsByTagName("iframe")[i].contentWindow.document.body.getElementsByClassName(el)[0]);}
		}
	}
	document.getElementsByTagName("iframe")[i].contentWindow.document.body.insertBefore(newSec, document.getElementsByTagName("iframe")[i].contentWindow.document.body.children[0]);
}

function liberty(i){
	var firstImage = document.getElementsByTagName("iframe")[i].contentWindow.document.body.querySelector('[id^="FIGURE-1-"]');
	var cln = firstImage.cloneNode(true);
	firstImage.id = 'originalImage: ' + firstImage.id;
	firstImage.style.display = 'none';
	document.getElementsByTagName("iframe")[i].contentWindow.document.body.insertBefore(cln, document.getElementsByTagName("iframe")[i].contentWindow.document.body.children[0]);
	my1980(i);
}

function my1980(i){
	var curBody = document.getElementsByTagName("iframe")[i].contentWindow.document.body,
	 bylineList = curBody.getElementsByClassName('byline'),
	 totByline = bylineList.length;
	for (var n=0; n<totByline; n++){
		var cln = bylineList[n].cloneNode(true);
		bylineList[n].id = 'originalByline'+n+': ' + bylineList[n].id;
		bylineList[n].style.display = 'none';
		if (curBody.children[curBody.children.length-1].className === 'pubnote'){curBody.insertBefore(cln, curBody.children[curBody.children.length-1]);}
		else{curBody.appendChild(cln);}	
	}
}

function changeIssue(issueN){
	document.getElementById(issueN).children[0].style.display = "block";
	document.getElementById("prev").style.display = "none";
	document.getElementById("next").style.display = "none";
	for (var i=1; i<document.getElementById(issueN).children.length; i++) {document.getElementById(issueN).children[i].style.display = "none";}
        var originButton = document.getElementById("Origin");
	if (originButton.hasAttribute("href")) {originButton.removeAttribute("href");}
	verifyMetaHighlight('0');
}

function getLinkOrigin(currentArticle, myOrigin) {
	var myFrame = currentArticle.children[0],
	elmnt = myFrame.contentWindow.document.head,
	myMeta = elmnt.getElementsByTagName("meta");
	for (var l = 0; l < myMeta.length; l++) {
		if (myMeta[l].name == "DC.identifier" && myMeta[l].scheme == "DCTERMS.URI") {
			myOrigin.href = myMeta[l].content;
			myOrigin.target = "_blank";
		}
	}
}

function changeArticleCommon(c, articleNum, myOrigin, isCover, strToSplit, issueNum){
	c[0].style.display = "none";
	for (var i=1; i<c.length; i++){
		if ("article" + i === articleNum){
			c[i].style.display = "block";
			getLinkOrigin(c[i], myOrigin);
			if (isCover) {
				top.window.location.href =  window.location.href.split(strToSplit)[0]+issueNum[0].toUpperCase()+issueNum.slice(1)+'.html#'+c[i].id;
				hidePrevAndNextAnc(i, true);
			}
			else {
				window.location.href = window.location.href.split(strToSplit)[0]+'#'+c[i].id;
				hidePrevAndNextAnc(i, false);
			}	
		}
		else {c[i].style.display = "none";}
	}
	verifyMetaHighlight(articleNum.charAt(articleNum.length-1));
}

function changeArticle(articleNum, issueNum){
	var c = document.getElementById(issueNum).children,
	myOrigin = document.getElementById("Origin");
	changeArticleCommon(c, articleNum, myOrigin, false, '#', issueNum);
}

function changeArticleCover(articleNum, issueNum){
	var c = window.parent.document.getElementById(issueNum).children,
	myOrigin = window.parent.document.getElementById("Origin");
	changeArticleCommon(c, articleNum, myOrigin, true, 'cover_pages/cover_page'+issueNum.charAt(issueNum.length-1)+'.html', issueNum);
}

function prevArticle() {
 	var articles = document.getElementsByClassName("article"); 	
 	for (var i = 1; i < articles.length; i++) { //i= 1 perché non voglio considerare il primo articolo
 		var frame = articles[i],
 			style = window.getComputedStyle(frame),
			displayValue = style.getPropertyValue('display'); //queste ultime due righe sono equivalenti a var displayValue = window.getComputedStyle(frame, null).display;
		if (displayValue === "block") {
			if (!(frame.classList.contains('article1'))) {
				frame.style.display = "none";
				var articleNow = articles[i-1];
				articleNow.style.display = "block";
				window.location.href =  window.location.href.split('#')[0]+'#'+articleNow.id;
				/* var myFrame = articleNow.children[0];
				var curIssue = articleNow.parentElement;
				var x = curIssue.children[i-1]; */
				var myOrigin = document.getElementById("Origin");
				getLinkOrigin(articleNow, myOrigin); // se scegliamo di definire la variabile myframe in questa funzione va sostituito articleNow con myFrame come parametro input della funzione getLinkOrigin
				verifyMetaHighlight(i);
				hidePrevAndNextAnc(i, false);
			}
		}
	}	
}

function nextArticle() {
	var articles = document.getElementsByClassName("article");
	for (var i = articles.length-2; i >= 0; i--) { //articles length = 5, ma noi non vogliamo considerare l'ultimo quindi mettiamo articles.lenght - 2 (con -1 considera anche l'ultimo perché length - 1 = 4 e articles[4] è l'ultimo articolo)
		var frame = articles[i],
    		style = window.getComputedStyle(frame),
			displayValue = style.getPropertyValue('display');
		if (displayValue === 'block') {
			if (!(frame.classList.contains('article5'))) { //IMPO: la classe dell'ultimo articolo è "article5"
				frame.style.display='none';
				articles[i+1].style.display = 'block';
				window.location.href =  window.location.href.split('#')[0]+'#'+articles[i+1].id;
				var myOrigin = document.getElementById("Origin");
				getLinkOrigin(articles[i+1], myOrigin);
				verifyMetaHighlight(i+2);
				hidePrevAndNextAnc(i+2, false);
			}
		}
	}
}

function hidePrevAndNext(issueNumber) {
	var issueC = document.getElementById(issueNumber).children;
	for (var d = 1; d < issueC.length; d++) {
		var curDivStyle = window.getComputedStyle(issueC[d], null).display; //if the element's display is being inherited or being specified by a CSS rule, you'll need to get its computed style. 
		if (curDivStyle === 'block') {
			hidePrevAndNextAnc(d, false);
		}
	}
}


function hidePrevAndNextAnc(index, isC) {
	if (isC) {
		if (index === 1) {
			window.parent.document.getElementById("next").style.display = 'block';
			window.parent.document.getElementById("prev").style.display = 'none';
		}
		else if (index === 5) { 
			window.parent.document.getElementById("prev").style.display = 'block';
			window.parent.document.getElementById("next").style.display = 'none';
		}
		else {
			window.parent.document.getElementById("prev").style.display = 'block';
			window.parent.document.getElementById("next").style.display = 'block';
		}
	}
	else {	
		if (index === 1) {		
			document.getElementById("prev").style.display = 'none';
			document.getElementById("next").style.display = 'block';
		}
		else if (index === 5) { 
			document.getElementById("prev").style.display = 'block';
			document.getElementById("next").style.display = 'none';
		}
		else {
			document.getElementById("prev").style.display = 'block';
			document.getElementById("next").style.display = 'block';
		}
	}		
}


function verifyMetaHighlight(n){
	if (document.getElementById('listIssue') == null){var listIssueChildren = window.parent.document.getElementById('listIssue').children;}
	else{var listIssueChildren = document.getElementById('listIssue').children;}
	for (var i=0; i<listIssueChildren.length; i++){
		for (var l=0; l<listIssueChildren[i].children.length; l++){
			var found = 0; //1 EERORE?
			for (var m=0; m<listIssueChildren[i].children[l].children.length; m++){
				var curUl= listIssueChildren[i].children[l].children[m];
				if(n>=1 && m>=1 && n==curUl.getAttribute('data-parent').charAt(curUl.getAttribute('data-parent').length-1)){//2 EERORE?
						found++;
				}
				if (curUl.style.display=='block'){
					if(n>=1 && n==curUl.getAttribute('data-parent').charAt(curUl.getAttribute('data-parent').length-1)){
						curUl.style.backgroundColor='#d8f3e6';
					}
					else{curUl.style.backgroundColor='white';}
				}
			}
			if (found>0){listIssueChildren[i].children[l].style.backgroundColor='cadetblue';}//3 EERORE?
			else{listIssueChildren[i].children[l].style.backgroundColor='white';}//4 EERORE?
		}
	}
}

function metadataViewer (issueN) { 
	var myList = document.getElementById("listIssue");  
	var myFrames = document.getElementById(issueN).getElementsByTagName("iframe");

    	for (var n = 1; n < myFrames.length; n++) { 
		var sc = document.createElement("script");
		sc.setAttribute('src', '../../script/main.js');
		myFrames[n].contentWindow.document.head.appendChild(sc);
		
	    	var elmnt = myFrames[n].contentWindow.document.body;
	    	var allIframeElements = elmnt.getElementsByTagName("*");
	    	for (var e = 0; e < allIframeElements.length; e++) {
	    		var x = allIframeElements[e].tagName; //ritorna una stringa che rappresenta il nome del tag in maiuscolo	    		
	    		var elementsWithSameTag = elmnt.querySelectorAll('[id^=' + CSS.escape(x) + ']'); //^ matches the start; the querySelectorAll method returns a static NodeList with elements matching the specified group of selectors; css.escape per assicurarsi che il valore sia codificato correttamente per l'uso in un'espressione CSS
	    		var len = elementsWithSameTag.length;
	    		allIframeElements[e].setAttribute("id", x+"-"+(len+1)+"-"+n);
	    	}		    	 
			// get span tag 
			var spans = Array.prototype.slice.call(elmnt.getElementsByTagName("span"));
			//first check: if the category already exist
			for (var span of spans) {
				// special cases
				if (span.innerText.toLowerCase() === "us") {span.innerText = "United States"}
				else if (span.innerText.toLowerCase() === "uk") {span.innerText = "United Kingdom"}

				// creating the variable for the parent
				var options = ["I", "A", "Q", "SPAN", "EM", "STRONG", "B", "CITE"];
				if (options.indexOf(span.parentNode.tagName) > -1) {
					var inlineParent = span.parentNode;
					var spanParent = inlineParent.parentNode;
				}
				else {var spanParent = span.parentNode;}
				var curCategory = span.className;  	//person
				var categoryFound = false;				
				var instanceFound = false;
				for (var a=0; a<myList.children.length; a++){ 	//a questo punto specificare se ci sono più classi
					if (curCategory === myList.children[a].className) { // invece di myList.children[a].id
						categoryFound = true;
						var matchedLi = myList.children[a];
					}
				}
				if (categoryFound === false) {
					createCategoryLi(curCategory, myList);
					var matchedLi = myList.getElementsByClassName(curCategory)[0];
				}
				else {
					for (c=0; c<matchedLi.children.length; c++){
						if (span.innerText.toLowerCase().includes(matchedLi.children[c].className.toLowerCase()) || matchedLi.children[c].className.toLowerCase().includes(span.innerText.toLowerCase())) { // partial matching
							instanceFound = true;
							var matchedUl = matchedLi.children[c];
						}
					}
				}
				if (instanceFound === false) {
					createInstanceUl(span.innerText, matchedLi, myList);
					var newUl = myList.getElementsByClassName(span.innerText)[0];
				}
				else {
					var newUl = matchedUl;
				}
				createOccurrenceLi(span, spanParent, span.innerText, newUl, n, myFrames, myList);	
			}
		
			// get time tag 
			var times = Array.prototype.slice.call(elmnt.getElementsByTagName("time"));
			//first check: if the category already exist
			for (var t=0; t<times.length; t++){
				// creating variable for parent
				if (options.indexOf(times[t].parentNode.tagName) > -1) { //options is used out of scope
					var inlineParent = times[t].parentNode;
					var timeParent = inlineParent.parentNode;
				}
				else {var timeParent = times[t].parentNode;}
				var myInstanceFound = false;
				if (t===0 && n===1) {createCategoryLi("time", myList);}
				else{
					for (r=0; r<myList.getElementsByClassName('time')[0].children.length; r++){  //document.getElementById('Time').children.length
						if ((times[t].dateTime === myList.getElementsByClassName('time')[0].children[r].className)) {  // qualcosa qui non funziona, forse, invece di id, class.. (createInstanceUl risulta avere parent null)   //document.getElementById('Time').children[r].className
							myInstanceFound = true;
							var matchedTimeUl = myList.getElementsByClassName('time')[0].children[r];  //document.getElementById('Time').children[r];
						}
					}
				}
				if (myInstanceFound === false) {
					createInstanceUl(times[t].dateTime, myList.getElementsByClassName('time')[0], myList);  //secondo parametro: document.getElementById('Time')
					var newUl = myList.getElementsByClassName(times[t].dateTime)[0];
				}
				else{var newUl = matchedTimeUl;}
				createOccurrenceLi(times[t], timeParent, times[t].dateTime, newUl, n, myFrames, myList);
			}
	}
}

function createCategoryLi(category, myList) {
	var newLi = document.createElement('li');
	newLi.setAttribute('class', category); // invece di ('id', category+i)
	//1. add showLiChildren
	newLi.setAttribute('onClick', "showLiChildren('"+myList.id+"', '"+category+"')");
	newLi.setAttribute('data-position', myList.children.length); //attributo per ordinare in base all'ordine di apparizione
	newLi.style.listStyleType = 'none';
	var liNode = document.createTextNode(category);
	newLi.appendChild(liNode);
	myList.appendChild(newLi);
}

function createInstanceUl(instance, parentLi, myList) {
	var newUl = document.createElement('ul');
	newUl.setAttribute('class', instance);
	newUl.setAttribute('onClick', "showUlChildren('"+myList.id+"', '"+instance+"', event)");
	newUl.setAttribute('data-position', parentLi.children.length);
	newUl.style.display = 'none';
	var ulNode = document.createTextNode(instance);
	newUl.appendChild(ulNode);
	var wikiLi = document.createElement('li'); //creiamo un elemento li che è il bottone cliccabile per arriavre alla pagina Wikipedia di instance
	wikiLi.setAttribute('id', 'wikiButton');
	var link = document.createElement('a'); //creiamo un elemento 'a'
	var normalizedInstance = instance.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //NFD Unicode Normal Form: scompone i grafemi in una combinazione di grafemi semplici per esempio e piu accento. la Regex invece è un range per eliminare gli accenti, quindi da u ad f.
	var hrefValue = 'http://en.wikipedia.org/wiki/'+normalizedInstance;  //costruiamo il link    
	link.setAttribute('onClick', 'wikiLink("'+hrefValue+'", event)'); //alternativa alla funzione inline, eventListener
	var wikiText = document.createTextNode("wikipedia");
	link.appendChild(wikiText);
	wikiLi.appendChild(link);
	newUl.appendChild(wikiLi);
	parentLi.appendChild(newUl);	
}

function wikiLink(newUrl, event) { 
	window.open(newUrl, "_blank"); 
	event.stopPropagation();
} 

function createOccurrenceLi(occurrence, occurrenceParent, occurrenceValue, newUl, n, myFrames, myList) {	//occurrenceValue è instance nella funzione precedente
	//se newUl.childNodes[0].nodeValue è in uppercase, ma occurrenceValue non lo è, allora metti in minuscolo newUl.childNodes[0].nodeValue, tranne la prima lettera:
	var ulTextNode = newUl.childNodes[0].nodeValue;
	if (ulTextNode === ulTextNode.toUpperCase() && occurrenceValue !== occurrenceValue.toUpperCase()) {
		if (/\s/g.test(ulTextNode)) {
			var words = ulTextNode.split(' ');  
	    	var CapitalizedWords = [];  
	    	words.forEach(element => {  
	        	CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length).toLowerCase());  
	    	});  
	    	newUlTextNode = CapitalizedWords.join(' ');  
    	}
    	else {newUlTextNode = ulTextNode[0].toUpperCase()+ulTextNode.slice(1).toLowerCase()} //codice ale per maiuscola uppercase in una parola singola e resto lowercase
    	newUl.childNodes[0].nodeValue = newUlTextNode;
	}


	var occurrenceLi = document.createElement('li');

	//recuperare il parent per scriverlo in instanceNode come punto di riferimento per l'user
	var parentTag = occurrenceParent.id.match(/([^-]+)/)[1];
	if (parentTag === "P") {parentTag = "paragraph"}
	else if (parentTag.startsWith("H")) {parentTag = "title"}
	else if (parentTag === "FIGCAPTION") {parentTag = "figure caption"}
	var parentNum = occurrenceParent.id.match(/-([^-]+)-/)[1];  
	var parentTagAndNum = (parentTag+" "+parentNum).toLowerCase();
	var instanceNode = document.createTextNode("article "+n+", "+parentTagAndNum+": "); //aggiungere stringa del titolo dell'articolo?
	
	occurrenceLi.style.display = 'none';
	occurrenceLi.appendChild(instanceNode);
	
	//numero di li il cui span o elemento time corrispondente ha lo stesso parent di quello corrente
	var pos = 0;
	// recuperare innerText dello span sibling (però NON VA BENE PER TIME!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
	for (var ulchild of newUl.children){
		if (occurrenceParent.id === ulchild.getAttribute('data-parent') && occurrenceValue === ulchild.getAttribute('data-inner') ){pos++;}
	}
	occurrenceLi.setAttribute('data-parent', occurrenceParent.id);	
	occurrenceLi.setAttribute('data-inner', occurrenceValue);

	var citNode = document.createTextNode('"'+ parsing(occurrence.innerText, occurrenceParent, pos)+'"'); //vedi se fare textNode o innerHTML
	occurrenceLi.appendChild(citNode); //appena tolto dal commento

	var occurrenceId = newUl.childNodes[0].nodeValue+"-"+(newUl.children.length+1);
	occurrence.setAttribute('id', occurrenceId);
	occurrenceLi.setAttribute('onclick', "highlight('"+occurrenceId+"', '"+myFrames[n].id+"', event)"); // per richiamare la funzione che evidenza il metadato nel testo dell'articolo quando si clicca sul <li> corrispondente nel metadata viewer

	newUl.appendChild(occurrenceLi);
	occurrence.setAttribute('onclick', "goToMetadata('"+myList.id+"', '"+newUl.childNodes[0].nodeValue+"')");
}
					
//from text keywords to metadata viewer
function goToMetadata(curListId, ulClass){
	var e = window.parent.document.getElementById(curListId).getElementsByClassName(ulClass)[0];
	e.style.display = 'block';
	var f = e.children;
	f[0].style.display = 'inline-block';
	for (var g=1; g<f.length; g++){f[g].style.display = 'block';}
	e.style.backgroundColor = "#FFDAB9";
	//e.scrollIntoView(true);
	e.scrollIntoView({behavior: "smooth", block: "center"});

	// animazione scomparsa colore background dopo 3 secondi:
	var backgroundAnimation = window.parent.document.createElement('style'); // può andare in contrsto con la funzione che cambia lo stile dell'articolo?
	backgroundAnimation.type = 'text/css';
	var keyFramePrefixes = ["-webkit-", "-o-", "-moz-", ""];
	var keyFrames = [];
	var textNode = null;
	for (var i in keyFramePrefixes) {
		keyFrames = '@'+keyFramePrefixes[i]+'keyframes background-fade {'+
		'80% { background-color: #FFDAB9; }'+
		//'100% { background-color: transparent; }'+
		'100% { background-color: cadetblue; }'+
		'}';
		var rules = window.parent.document.createTextNode(keyFrames);
	}
	backgroundAnimation.appendChild(rules);
	window.parent.document.getElementsByTagName("head")[0].appendChild(backgroundAnimation);

	e.style.animation = 'background-fade 3s forwards';
	e.style.WebkitAnimation = 'background-fade 3s forwards';
	e.style.OAnimation = 'background-fade 3s forwards';
	e.style.MozAnimation = 'background-fade 3s forwards';

	setTimeout(function() {
		//e.style.backgroundColor = 'transparent';
		e.style.backgroundColor = 'cadetblue';
		e.style.WebkitAnimationName = '';
		e.style.animation = '';
		e.style.OAnimation = '';
		e.style.MozAnimation = '';
		window.parent.document.getElementsByTagName("head")[0].removeChild(backgroundAnimation);
	}, 10000); // we have to reset the name of animation otherwise another call to background-fade wont have any effect
	var parentPage = window.parent.document,
	    issueId = parentPage.querySelector('[id^="issue"]').id;
	verifyMetaHighlight(parentPage.location.href.split('#')[1].replace('article', '')-((issueId.charAt(issueId.length-1)-1)*5));
     	event.stopPropagation();
}

function showLiChildren(myListId, instanceId){
	var e = document.getElementById(myListId).getElementsByClassName(instanceId)[0].children;
	if(e[0].style.display == 'block') {
		for (var child of e) {
			child.style.display = 'none';
			var f = child.children;
			for (var g of f) { g.style.display = 'none'; }
		}
	}
	else{
		for (var child of e) {
			child.style.display = 'block';
			var f = child.children;
			// non mostrare i figli <li> degli <ul> tranne il primo figlio di ogni <ul>, cioè il link a wikipedia
			for (var g = 0; g < f.length; g++) {
				if (g === 0) {f[g].style.display = "inline-block";}
				else {f[g].style.display = 'none';}
			}

		}
	}
	var curArt= window.location.href.split('#')[1].replace('article', '')-((document.querySelector('[id^="issue"]').id.charAt(document.querySelector('[id^="issue"]').id.length-1)-1)*5);
	verifyMetaHighlight(curArt);
}

function showUlChildren(myListId, instanceId, event){
	var e = document.getElementById(myListId).querySelector('[class="'+instanceId+'"]').children;
	var allArt = document.getElementsByClassName('article');
	var curArt= window.location.href.split('#')[1].replace('article', '')-((document.querySelector('[id^="issue"]').id.charAt(document.querySelector('[id^="issue"]').id.length-1)-1)*5);
	if(e[1].style.display == 'block'){
		for (var i=1; i<e.length; i++){
			e[i].style.display = 'none';
			e[i].style.backgroundColor = "white";
		}
	}
	else{
		for (var i=1; i<e.length; i++){
			e[i].style.display = 'block';
			if (e[i].getAttribute('data-parent').charAt(e[i].getAttribute('data-parent').length-1) == curArt){
			    e[i].style.backgroundColor = "#d8f3e6";   //#f3f3f3
			}	
		}
	}
	event.stopPropagation();	
}

function parsing(instance, parent, numIstanza){
	var container = parent.innerText;
	if (instance.includes("(") && instance.includes(")")){ //modificate le parentesi con le corrispettive espressioni in regexp
		var cleanInstance = instance.replace(/\(/g, "\\S*\(").replace(/\)/g, "\\S*\)");
	} 
	else{
		var cleanInstance = instance;
	}
	var e = new RegExp("(\\S+\\s){0,5}\\S*" + cleanInstance + "(\\’?\\)?\\,?\\s+\\S+){0,5}", "ig");
  	var res = container.match(e);
  	return res[numIstanza];
}

/* Element.prototype.documentOffsetTop = function () {
	    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
	}; */

function highlight(spanId, iFrameN, event) {
	//cambiare articolo da mattere in display:block se il metadato cliccato è in un articolo diverso rispetto a quello corrente
	var curIFrameDiv = document.getElementById(iFrameN).parentNode;
	var curIssueDivs = curIFrameDiv.parentNode.children;
	var originButton = document.getElementById("Origin");	
	changeArticleCommon(curIssueDivs, curIFrameDiv.classList[0], originButton, false, '#'); //in questo modo supponiamo che né il div target né quello di provenienza sia quello di una cover

	var elmnt = document.getElementById(iFrameN).contentWindow.document;
	var curInstance = elmnt.getElementById(spanId);
	curInstance.style.backgroundColor = "#ffff00";
	//curInstance.scrollIntoView(true);
	curInstance.scrollIntoView({behavior: "smooth", block: "center"});

	// animazione scomparsa colore background dopo 10 secondi:
	var cssAnimation = elmnt.createElement('style'); // può andare in contrsto con la funzione che cambia lo stile dell'articolo?
    cssAnimation.type = 'text/css';

	var keyFramePrefixes = ["-webkit-", "-o-", "-moz-", ""];
	var keyFrames = [];
	var textNode = null;

	for (var i in keyFramePrefixes) {
		keyFrames = '@'+keyFramePrefixes[i]+'keyframes background-fade {'+
		//'80% { background-color: #ffff00; }'+
		'80% { background-color: #B5D3E7; }'+
		'100% { background-color: transparent; }'+
		'}';
		var rules = elmnt.createTextNode(keyFrames);
	}

	cssAnimation.appendChild(rules);
	elmnt.getElementsByTagName("head")[0].appendChild(cssAnimation);

	curInstance.style.animation = 'background-fade 10s forwards';
	curInstance.style.WebkitAnimation = 'background-fade 10s forwards';
    curInstance.style.OAnimation = 'background-fade 10s forwards';
    curInstance.style.MozAnimation = 'background-fade 10s forwards';

    setTimeout(function() {
    	//curInstance.style.backgroundColor = 'transparent';
	curInstance.style.backgroundColor = '';
    	curInstance.style.WebkitAnimationName = '';
    	curInstance.style.animation = '';
        curInstance.style.OAnimation = '';
        curInstance.style.MozAnimation = '';
        elmnt.getElementsByTagName("head")[0].removeChild(cssAnimation);
    	}, 10000); // we have to reset the name of animation otherwise another call to background-fade wont have any effect
	
     event.stopPropagation();
}

function sortOccurrences(keyToSearch){
	var elements = document.getElementById("metadata").children;
		sortCategory(document.getElementById("listIssue"), keyToSearch);
		for (var n = 0; n < document.getElementById("listIssue").children.length; n++){
			sortCategory(document.getElementById("listIssue").getElementsByClassName(document.getElementById("listIssue").children[n].className)[0], keyToSearch);
		}
}

function sortByFreq() {
	//var elements = document.getElementById("metadata").children;
	//parte 1: assegnare l'attributo data-frequency a ogni li e ogni ul
	//for (var i = 1; i < elements.length; i++) { //entriamo in ognuna delle liste
		var curListCategories = document.getElementById('listIssue').children; //<li> di ogni lista
		for (var g = 0; g < curListCategories.length; g++) {
			var curListCategoriesUl = curListCategories[g].children; //ul di ogni li
			curListCategories[g].setAttribute('data-frequency', curListCategoriesUl.length); //creiamo attributo data-frequency per ogni li, che ha come valore la lunghezza della lista dei suoi figli
			for (k = 0; k < curListCategoriesUl.length; k++) { //entriamo in ogni ul
				curListCategoriesUl[k].setAttribute('data-frequency', curListCategoriesUl[k].children.length); //assegnamo l'attributo data-frequency anche a ogni ul, il cui valore è il totale del figli di quell'ul
			}
		}

		//parte 2: ordinare secondo il valore dell'attributo
		sortCategory(document.getElementById("listIssue"), 'data-frequency');
		var numCategories = document.getElementById("listIssue").childNodes.length;
		while (numCategories--) { document.getElementById("listIssue").appendChild(document.getElementById("listIssue").childNodes[numCategories]);}
		
		for (var n = 0; n < document.getElementById("listIssue").children.length; n++){
			sortCategory(document.getElementById("listIssue").getElementsByClassName(document.getElementById("listIssue").children[n].className)[0], 'data-frequency');
			var numIstances = document.getElementById("listIssue").children[n].children.length;
			while (numIstances--) { document.getElementById("listIssue").children[n].appendChild(document.getElementById("listIssue").children[n].children[numIstances]); }
		}
	//}

}

function sortCategory(list, searchKey) {
  var i, switching, b, shouldSwitch;
  switching = true;
  while (switching) {
  	switching = false;
  	b = list.children;
  	for (i = 0; i < (b.length - 1); i++) {
      		shouldSwitch = false;
		if (!isNaN(b[i].getAttribute(searchKey))){var myStr = parseInt(b[i].getAttribute(searchKey))>parseInt(b[i+1].getAttribute(searchKey));}
		else{var myStr = b[i].getAttribute(searchKey).toLowerCase() >b[i+1].getAttribute(searchKey).toLowerCase();}
      		if (myStr) {shouldSwitch = true; break;}
    	}
    	if (shouldSwitch) {b[i].parentNode.insertBefore(b[i + 1], b[i]); switching = true;}
  }
}

/*function showMetaContent(){
	if (document.getElementById('contentToShow').style.display === 'none'){document.getElementById('contentToShow').style.display = 'block';}
	else{document.getElementById('contentToShow').style.display = 'none';}
}*/
function showMetaContent(){
	document.getElementById('metaDiv').style.display = 'block';
}

function closeMetaContent(){
	document.getElementById('metaDiv').style.display = 'none';
}

function findOrigin(){
	if(window.location.href.includes('#article')){
		if(document.getElementById("Origin").href.length <1){
			getLinkOrigin(document.getElementById(window.location.href.slice(window.location.href.indexOf('#')+1, window.location.href.length)), document.getElementById("Origin"));
		}
	}
}

function onresizeFunc(){
	var docuParagraphs = document.getElementsByClassName('docuParagraph');
	if (window.innerWidth < 799){var curStyle = 'none';}
	else{var curStyle = 'block';}
	for (var n=0; n<docuParagraphs.length; n++){docuParagraphs[n].style.display=curStyle;}
}

function showStyleDocu(a) {
	if (window.innerWidth < 799){
	      if (document.getElementById(a).style.display==='none'){document.getElementById(a).style.display='block';}
	      else{document.getElementById(a).style.display='none';}
    	}
}




/*///////prova per slideshow///////*/
var indexList= [0, 0, 0, 0, 0, 0];
var curTimeout; //= setTimeout(showSlides, 2500);

function showSlides() {
	for (var n = 0; n<indexList.length; n++){
		var i;
		var slides = document.getElementsByClassName('mySlides'+(n+1));
		var dots = document.getElementsByClassName('slideColumn'+(n+1));
		for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";  
		}
		indexList[n]++;
		if (indexList[n] > slides.length) {indexList[n] = 1}    
		for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active", "");
		}
		slides[indexList[n]-1].style.display = "block";  
		dots[indexList[n]-1].className += " active";
	}
	curTimeout = setTimeout(showSlides, 2500);
	// setTime();
}

function currentSlide(n, m) {showCurSlide(indexList[m-1]=n, m);}

function showCurSlide(n, m) {
	clearTimeout(curTimeout);
	var i;
	var slides = document.getElementsByClassName('mySlides'+m);
	var dots = document.getElementsByClassName('slideDemo'+m);
	if (n > slides.length) {indexList[m-1] = 1}
	if (n < 1) {indexList[m-1] = slides.length}
	for (i = 0; i < slides.length; i++) {
	slides[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
	dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[indexList[m-1]-1].style.display = "block";
	dots[indexList[m-1]-1].className += " active";
	curTimeout = setTimeout(showSlides, 4000);
}





