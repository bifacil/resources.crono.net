
function createUltraMenu(){
	$('#u-left-panel .left-menu-wrapper').ultraMenu({
		
		// Collapse Panel ON/OFF
		collapsePanel: true,
		preCollapse: false,

		// Panel Width Settings
		panelWidth: 240,
		collapsePanelWidth: 50,

		// JS based Offcanvas Effect
		offCanvas: false,
		offCanvasSpeed: 200,
		offCanvasClass: 'offcanvas-mode',

		// Horizontal Mode
		horizontal: false,
		horizontalClass: 'panel-horizontal',


		// Show on hover
		showHover: false,

		// RTL Mode
		rtl: false

	});
}

// Slimscroll Selector
var selector_slim = $('#u-left-menu');
// Slimscroll Handlers
function handleScrollResize(){
    var color1;
    if($('body').hasClass('skin-light')){
        color1 = '#000';
    }
    else {
        color1 = '#fff';
    }

    if(selector_slim.parent('.slimScrollDiv').length === 1){
        selector_slim.slimScroll({
            destroy: true
        });
    }
    /*
	var slimHeight = $('#u-left-panel').height();
	$('#u-left-panel').children(':not(#u-left-menu)').each(function () {
		slimHeight = slimHeight - $(this).height();
	});*/
	var slimHeight = $(window).height() - selector_slim.offset().top -20; // -20 porque el cálculo no es del todo correcto, supongo que cuando se añade la sidebar, quedan por algún lado 20px extra
    selector_slim.slimScroll({
        height: slimHeight, // Value 190 is measured by Hit and Trial (Caliberation required) 
        color: color1,
        size: '7px',
        opacity: '0.4',
        wheelStep: 15.0
    });
}

function adjustParameter() {
	var height = $(document).height();
    // Setting min-height via CSS (reqired)
    $("<style type='text/css'> #u-left-panel{ min-height: " + height +"px; } .content-panel{ min-height: " + (height - 80) +"px;} </style>").appendTo("head");

}


function initUltraMenu(){
	createUltraMenu(); //Inicializa el menu lateral (permite colapsar el menú, desplear y plegar los items desplegables, ...)
	adjustParameter();
	//handleScrollResize(); //añade scroll en el menú lateral si es necesario
	//window.prettyPrint && prettyPrint();
}


$(document).ready(function() {
	initUltraMenu();
});