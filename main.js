/**
 * main.js
 *
**/

(function () {
'use strict';

// var amountMade = 1000; // dollars
// var periodLength = 20; // days - M-F of one month
// var expenses = {
// 	rent: 500,
// 	groceries: 200,
// 	electric: 100,
// 	gas: 50,
// 	leftover: 150
// };
// var amountMade = 400; // dollars
// var periodLength = 4; // days - M-F of one month
// var expenses = {
// 	rent: 200,
// 	gas: 50,
// 	electric: 150
// };
// var amountMade = 425; // dollars
// var periodLength = 4; // days - M-F of one month
// var expenses = {
// 	rent: 200,
// 	gas: 25,
// 	restaurants: 25,
// 	other: 25,
// 	electric: 150
// };
var amountMade = 2000; // dollars
var periodLength = 20; // days - M-F of one month
var expenses = {
	rent: 1000,
	gas: 75,
	restaurants: 140,
	gifts: 35,
	travel: 130,
	electric: 150,
	xbox: 325,
	muffins: 10,
	donuts: 12,
	other: 123
};
var expensePercentages = {};
var expensesInDays = {};
var days = {};

for (var expense in expenses) {
    expensePercentages[expense] = expenses[expense] / amountMade;
}

for (var percent in expensePercentages) {
    expensesInDays[percent] = periodLength * expensePercentages[percent];
}

for (var i = 1; i <= periodLength; i++) {
    days[i] = {};
}

// "expensesInDaysClone"
var eidc = $.extend(true, {}, expensesInDays);

// https://css-tricks.com/snippets/javascript/inject-new-css-rules/
function injectStyles(rule) {
  var div = $('<div />', {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo('body');    
}

function sumOfProps (o) {
	// Note: Returns 0 even if there are no properties in the obj at all
	var sum = 0;
	for (var prop in o) {
		sum = sum + o[prop];
	}
	return sum;
}

for (var day in days) {
	var n = 0;
	while (sumOfProps(days[day]) < 1) {
		var firstProp = Object.keys(eidc)[0];
		var secondProp = Object.keys(eidc)[1];

		// safeguard against having a runaway while loop during debugging
		n++;
		if (n > 1000) {
			console.warn('we had a problem');
			break;
		}

		if (Object.keys(eidc).length === 0) {
			console.log('we reached the end');
			break;
		}

		var diff = null;

		if (eidc[firstProp] < 1) {
			if ((sumOfProps(days[day]) + eidc[firstProp]) >= 1) {
				diff = 1 - sumOfProps(days[day]);
				eidc[firstProp] = eidc[firstProp] - diff;
				days[day][firstProp] = diff;
				delete eidc[firstProp];
			} else if ((sumOfProps(days[day]) + eidc[secondProp]) >= 1) {
				days[day][firstProp] = eidc[firstProp];
				diff = 1 - sumOfProps(days[day]);
				eidc[secondProp] = eidc[secondProp] - diff;
				days[day][secondProp] = diff;
				delete eidc[firstProp];
			} else {
				days[day][firstProp] = eidc[firstProp];
				delete eidc[firstProp];
			}			
		}

		if (eidc[firstProp] === 1) {
			days[day][firstProp] = 1;
			delete eidc[firstProp];	
		}

		if (eidc[firstProp] > 1) {
			days[day][firstProp] = 1;
			eidc[firstProp]--;	
		}
	}
}

for (var o in days) {
	console.log(days[o]);
}

console.log('the end');

var classes = [];
var s = 0;

for (var dayObj in days) {
	
	$('<div>', {
		id: 'day' + s,
	}).appendTo('#calContainer');

	for (var prop in days[dayObj]) {
		$('<span>', {
			class: prop,
			style: 'height:' + (days[dayObj][prop] * 100) + '%;',
			text: prop
		}).appendTo('#day' + s);
	}
	if (classes.indexOf(prop) === -1) {
		classes.push(prop);
	}
	s++;
}

classes.forEach(function (className) {
	injectStyles('#calContainer div span.' + className + ' { background-color: ' + randomColor() + '; }');
	$('#calContainer div span.' + className).hover(
       function(){ $('#calContainer div span.' + className).addClass('hover'); },
       function(){ $('#calContainer div span.' + className).removeClass('hover'); }
	);
});


var dayTds = $('#calendar').find('td');

// Ported from
// http://www.skylighters.org/special/chrono/perpetual.html
// Script Copyright (c) 1998 by Ricky Duval
function generateCalendar(month, year) {

	var numDays = 31;

	if ( (month === 3) || (month === 5) || (month === 8) || (month === 10)) {
		numDays = 30;
	}
	if ((month === 1)) {
		numDays = 28;
		if (((year % 4) === 0) && ((year % 100) !== 0)) {
			numDays = 29;
		}
        if ((year % 400) === 0) {
        	numDays = 29;
		}
	}

    var firstDay = new Date(year, month, 1).getDay();
    var j = firstDay;
    for(var i = 1; i <= numDays; i++) {
        $('<span>', {
			text: i
		}).appendTo(dayTds[j]);
        j++;
    }
}

function resetCalendar () {
	$.each(dayTds, function (ind, val) {
		$(val).empty();
	});
}

function init() {
	$('#genCalBtn').click(function () {
		resetCalendar();
		generateCalendar(parseInt($('#monthSelect').val(), 10), parseInt($('#yearFld').val(), 10));
	});
	$('#calGenForm').submit(function (evt) {
		evt.preventDefault();
		resetCalendar();
		generateCalendar(parseInt($('#monthSelect').val(), 10), parseInt($('#yearFld').val(), 10));
	});
}

$(document).ready(init);

}());
