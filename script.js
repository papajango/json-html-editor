(function() {
	'use strict';

	/* global $ */

	var example = [
		{
			name: 'John',
			age: 50
		},
		{
			age: '15',
			hobby: 'swimming'
		},
		{
			name: 'Anna',
			hobby: 'programming'
		}
	];

	$('.example').html(JSON.stringify(example));

	var $deleteRowLink = $(
		'<a class="btn btn-danger delete-row-link" href="#" title="Delete row">-</a>'
	);
	var $appendRowLink = $(
		'<a class="btn btn-success append-row-link" href="#" title="Append row">+</a>'
	);
	var $selector = $('#generated-table');
	var $loadDataLink = $('.load-data');
	var $clearDataLink = $('.clear-data');
	var $generateJsonLink = $('#generate-json');
	var $inputDataArea = $('#input-data');
	var inputJson = [];

	function addHeadings(arr) {
		$selector.append(
			$('<thead />').append($('<tr />').append($('<th />').html('#')))
		);
		var $tr = $selector.find('thead tr');
		for (var i = 0; i < arr.length; i++) {
			$tr.append('<th>' + arr[i] + '</th>');
		}
	}

	function addCeils(uniqueKeys) {
		$selector.append($('<tbody />'));
		var listObj = {};
		for (var i = 0; i < inputJson.length; i++) {
			listObj = inputJson[i];
			var $tr = $('<tr />');
			$tr.append($('<td />').html(i));
			for (var k = 0; k < uniqueKeys.length; k++) {
				var ceilValue = listObj[uniqueKeys[k]];
				if (ceilValue == null) {
					ceilValue = '';
				}
				var $td = $('<td />');
				var $input = $(
					'<input class="form-control" data-row-number="' +
						i +
						'" name="' +
						uniqueKeys[k] +
						'" value="' +
						ceilValue +
						'" />'
				);

				$tr.append($td.append($input));
			}
			var $actionTd = $('<td />');
			$actionTd
				.append($deleteRowLink.clone(true))
				.append($appendRowLink.clone(true));
			$tr.append($actionTd);
			$selector.find('tbody').append($tr);
		}
	}

	function loadJson() {
		$selector.html('');
		var str = $inputDataArea.val();
		if (str == '') {
			alert('Empty textarea!');
			return false;
		}
		if (
			!/^[\],:{}\s]*$/.test(
				str
					.replace(/\\["\\\/bfnrtu]/g, '@')
					.replace(
						/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
						']'
					)
					.replace(/(?:^|:|,)(?:\s*\[)+/g, '')
			)
		) {
			alert('Json is not valid!');
			return false;
		}
		inputJson = JSON.parse(str);

		var keys = [];
		for (var i = 0; i < inputJson.length; i++) {
			$.merge(keys, Object.keys(inputJson[i]));
		}
		var uniqueKeys = $.unique(keys);
		addHeadings(uniqueKeys);
		addCeils(uniqueKeys);
		$generateJsonLink.removeClass('disabled');
		return false;
	}

	function generateJson() {
		var arr = [],
			propName = '',
			propValue = '';
		$.each($selector.find('tbody tr'), function() {
			var tdObj = {};
			$.each($(this).find('td'), function() {
				var $input = $(this).find('input');
				propName = $input.attr('name');
				propValue = $input.val();
				if (propName != null) {
					tdObj[propName] = propValue;
				}
			});
			arr.push(tdObj);
		});

		$inputDataArea.val(JSON.stringify(arr));
	}

	function deleteRow() {
		$(this)
			.parent('td')
			.parent('tr')
			.remove();
		updateIndexes();
		return false;
	}

	function appendRow() {
		var $tr = $(this)
			.parent('td')
			.parent('tr');
		var $cloneTr = $tr.clone();
		$cloneTr.find('input').val('');
		$tr.after($cloneTr);
		updateIndexes();
		return false;
	}

	function updateIndexes() {
		$.each($selector.find('tbody tr'), function(index) {
			$(this)
				.find('td')
				.first()
				.html(index);
		});
	}

	function clearData() {
		$inputDataArea.val('');
		return false;
	}

	$loadDataLink.on('click', loadJson);
	$clearDataLink.on('click', clearData);
	$generateJsonLink.on('click', generateJson);
	$deleteRowLink.on('click', deleteRow);
	$appendRowLink.on('click', appendRow);
})();
