// ==UserScript==
// @name         pinterest img download
// @namespace    https://www.pinterest.com/
// @version      1.0
// @description  download img from pinterest
// @author       CallMeTOmmy
// @match        https://www.pinterest.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //param
    let minWidth = 100;
    let minHeight = 100;
    let imgService = null;

    //create content
    let appContents = document.getElementsByClassName('appContent');
   	if(appContents.length !== 1) {
   		throw new Error('pinterest html changed');
   	}

   	let content = document.createElement('div');
   	content.style.width = '100%';
   	content.style.height = '80px';
   	content.style.background = 'black';
	appContents[0].insertBefore(content,appContents[0].childNodes[0]);

    //create button
   	const startButtonText = ' record images';
    let start = createButton({
        name: 'start' + startButtonText,
        click: function() {

            //init
            if(!imgService) {
            	imgService = new imgParse(minWidth,minHeight);
            	imgService.register((imgs) => {
            		countContent.innerText = imgs.length;
            	});
            	imgService.init();
            	start.innerHTML = 'stop' + startButtonText;
            }
            else {
            	imgService.stop();
            	imgService.clearRegister();
            	start.innerHTML = 'start' + startButtonText;
            }

            return false;
        }
    });

    let countContent = document.createElement('span');
    countContent.style.color = 'white';
    countContent.style.fontSize = '30px';
    countContent.style.margin = '0 10px 0 10px';


    let showImgsUrl = createButton({
    	name: 'show record images url',
    	click: function() {
    		if(!imgService)
    			throw new Error('can not find imgService');

    		let imgs = imgService.getImgs();
    		imgs.forEach((img) => {
    			document.write(img.src.replace('236','564'));
    			document.write('<br>');
    		});
    	}
    });

    content.appendChild(start);
    content.appendChild(countContent);
    content.appendChild(showImgsUrl);

    //common function
    function createButton(option) {
        if (!option) return;
        let btn = document.createElement('button');
        btn.innerHTML = option.name;
        btn.onclick = option.click;
        btn.style.margin = '0 0 0 10px'
        btn.style.fontSize = '20px';
        return btn;
    }

    class imgParse {

        constructor(minWidth, minHeight) {

        	if(minHeight === undefined || minHeight === undefined)
        		throw new Error('param error');

            this._minWidth = minWidth;
            this._minHeight = minHeight;
            this._imgs = [],
            this._time = 50,
            this._startFlag = false;
            this._t = null;
        }

        init() {
        	this._startFlag = true;
        	this._t = setInterval(() => {
        		let allImgs = this._getAllImg();
        		let imgs = this._filterExist(allImgs);
        		this._imgs.push(...imgs);

        		if(this._callback) {
        		   this._callback.forEach((cb) => {
        		   		cb(this.getImgs());
        		   });
        		}

        	},this._time);
        }

        register(cb) {
        	if(!this._callback)
        		this._callback = [];

        	this._callback.push(cb);
        }

        endRegister(cb) {
        	if(!this._callback)
        		this._callback = [];

        	this._callback.splice(this._callback.indexOf(cb),0);
        }

        clearRegister() {
        	if(this._callback)
        		this._callback = [];
        }

        stop() {
        	this._startFlag = false;
        	clearInterval(this._t);
        }

        getImgs() {
        	return this._imgs;
        }

        _getAllImg() {
            let imgs = Array.from(document.getElementsByTagName('img'));
            return imgs.filter((v, i) => {
                return v.width > this._minWidth && v.height > this._minHeight;
            });
        }

        _filterExist(imgs) {
        	return imgs.filter((v) => {
        		return this._imgs.indexOf(v) === -1;
        	});
        }
    }

})();


let pinterestClass = 1;