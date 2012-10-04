package com.intermedia.components;

import js.Lib;
import js.Dom;

import brix.component.ui.DisplayObject;

/**
 * 
 */
class ResizeGallery extends DisplayObject{

	/**
	 * constructor
	 */
	public function new(rootElement:HtmlDom, SLPId:String) {
		super(rootElement, SLPId);
		Lib.document.body.addEventListener("resize", onResize, false);
		onResize(null);
	}
	public function onResize(e) {

		//trace("ResizeGallery - "+rootElement+", "+Lib.document.body.clientWidth+", "+Lib.document.body.clientHeight);

		if((Lib.document.body.clientHeight < 780)&&(Lib.document.body.clientWidth < 980)){
			rootElement.style.width = "115.5px";
			rootElement.style.height = "56.7px";
			rootElement.style.marginLeft = "185px";
			rootElement.style.marginTop = "19px";
	
	

		}

	}
}

