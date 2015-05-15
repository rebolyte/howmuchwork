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

// https://css-tricks.com/snippets/javascript/inject-new-css-rules/
function injectStyles(rule) {
  var div = $('<div />', {
  	class: 'injected',
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

// Apparently, the javascript Date function allows you to overflow the day 
// number parameter that you pass, creating a date in the next month. 
// Deliberately overflowing the day parameter and checking how far the 
// resulting date overlaps into the next month is a quick way to tell how many
// days there were in the queried month.
// -- http://www.dzone.com/snippets/determining-number-days-month
// http://stackoverflow.com/q/7827838/2486583
function daysInMonth(month, year) {
	return 32 - new Date(year, month, 32).getDate();
}

// Javascript has a little quirk where a date of zero will set the date to be 
// the last day of the previous month. Likewise is there are 30 days in a 
// month and you set a date of 31 it will be the 1st day of the next month, a 
// date of 40 would be the 10th day of the next month.
// -- http://www.hunlock.com/blogs/Javascript_Dates-The_Complete_Reference
// function daysInMonth(month, year) {
// 	return new Date(year, month, 0).getDate();
// }

function isWeekday(year, month, day) {
	var d = new Date(year, month, day).getDay();
	return (d !== 0) && (d !== 6);
}

function weekdaysInMonth(month, year) {
	var days = daysInMonth(month, year);
	var weekdays = 0;
	for (var i = 0; i < days; i++) {
    	if (isWeekday(year, month, i+1)) {
    		weekdays++;
    	}
	}
	return weekdays;
}

function genExpensesInDays (periodLength /* Int */, amountMade /* Int */, expenses /* Obj */) {
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

	// for (var o in days) {
	// 	console.log(days[o]);
	// }

	return days;
}

function vizExpenses (expensesPerDayObj) {
	var classes = [];
	var s = 0;
	var toFills = $('#calendar').find('td.toFill');
	for (var dayObj in expensesPerDayObj) {
		
		$('<div>', {
			id: 'day' + s,
		}).appendTo(toFills[dayObj - 1]); // finally a situation to take advantage of the damned coercion

		for (var prop in expensesPerDayObj[dayObj]) {
			var propDataName = prop.replace(/\s+/g, '-').toLowerCase();
			var sizeStyle = expensesPerDayObj[dayObj][prop] < 0.2 ? ' font-size: 8pt;' : '';

			$('<span>', {
				class: propDataName,
				style: 'height:' + expensesPerDayObj[dayObj][prop] * 100 + '%;' + sizeStyle,
				text: prop
			}).appendTo('#day' + s);

			if (classes.indexOf(propDataName) === -1) {
				classes.push(propDataName);
			}
		}
		s++;
	}

	var colors = randomColor({hue: 'green', luminosity: 'dark', count: classes.length});

	classes.forEach(function (className) {
		injectStyles('#calendar td > div > span.' + className + ' { background-color: ' + colors.shift() + '; }');
		$('#calendar td > div > span.' + className).hover(
			function () { $('#calendar td > div > span.' + className).addClass('hover'); },
			function () { $('#calendar td > div > span.' + className).removeClass('hover'); }
		);
	});
}

var dayTds = $('#calendar').find('td');

// Ported from
// http://www.skylighters.org/special/chrono/perpetual.html
// Script Copyright (c) 1998 by Ricky Duval
function generateCalendar(month, year) {

	var numDays = 31;

	if ((month === 3) || (month === 5) || (month === 8) || (month === 10)) {
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
		if (isWeekday(year, month, i)) {
			$(dayTds[j]).addClass('toFill');
		}
        j++;
    }
}

function resetCalendar () {
	$.each(dayTds, function (ind, val) {
		$(val).empty();
		$(val).removeClass('toFill');
	});
	$.each($('body').find('.injected'), function (ind, val) {
		$(val).remove();
	});
}

function init() {
	// $('#genCalBtn').click(function () {
		
	// });
	$('#calGenForm').on('submit', function (evt) {
		var mInt = parseInt($('#monthSelect').val(), 10);
		var yInt = parseInt($('#yearFld').val(), 10);
		var amountMade = parseInt($('#amountMadeFld').val(), 10);
		var expenses = {};
		
		$.each($('#expenses').find('.input-group'), function (ind, val) {
			var cat = $(val).find('input.expenseCategoryFld').val();
			var amnt = parseInt($(val).find('input.expenseAmountFld').val(), 10);
			expenses[cat] = amnt;
		});

		evt.preventDefault();
		resetCalendar();
		generateCalendar(mInt, yInt);
		vizExpenses(genExpensesInDays(weekdaysInMonth(mInt, yInt), amountMade, expenses));
	});

	$('#expenseForm').on('click', 'button.expenseAddBtn', function (evt) {
		var group = $('#firstExpenseGroup').clone().appendTo('#expenses');
		$.each($(group).find('input'), function (ind, val) {
			$(val).val('');
		});
	});
}

$(document).ready(init);

}());
