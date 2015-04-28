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
	}).appendTo('#container');

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
	injectStyles('#container div span.' + className + ' { background-color: ' + randomColor() + '; }');	
});

// http://www.skylighters.org/special/chrono/perpetual.html

// Script Copyright (c) 1998 by Ricky Duval
// You may copy this script, but ONLY if it remains INTACT
// including this message.  Thank you!!

function PrintCalendar(form) {

    for (i=1;i<=42;i++)
        {self.document.Calendar.elements[i].value="";}

    Month = form.elements[0].selectedIndex;
    Year  = form.elements[1].value;

    if (Month === 0)  MonthName = "January";
    if (Month === 1)  MonthName = "February";
    if (Month === 2)  MonthName = "March";
    if (Month === 3)  MonthName = "April";
    if (Month === 4)  MonthName = "May";
    if (Month === 5)  MonthName = "June";
    if (Month === 6)  MonthName = "July";
    if (Month === 7)  MonthName = "August";
    if (Month === 8)  MonthName = "September";
    if (Month === 9)  MonthName = "October";
    if (Month === 10) MonthName = "November";
    if (Month === 11) MonthName = "December";

    Text = MonthName+", "+Year;
    l = Text.length;
    for (i=1;i<(16-l)/2;i++) 
        {Text = " "+Text;}
    self.document.Calendar.elements[0].value=Text;

    NumDays=31;
    if ((Month==3)||(Month==5)||(Month==8)||(Month==10))
        {NumDays=30;}
    if ((Month==1)) {
        NumDays=28;
        if((Year%4===0)&&(Year%100!==0)) {NumDays=29;}
        if(Year%400===0) {NumDays=29;}
        }

    TempDate = new Date(Year, Month, 1);
    FirstDay = TempDate.getDay();
    i = FirstDay + 1;
    for(c=1;c<=NumDays;c++) {
        self.document.Calendar.elements[i].value=c;
        i++;
    }

}

}());