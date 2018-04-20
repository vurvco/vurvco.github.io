_GLOBAL = {
	init: false,
	start: 0,
	end: 100,
	tweets: [],
	userId: new Date().getTime() + '_temp',
	sessionCol: false,
	rowIndexFavs: [],
	rowIndexFavsPlus: []
};

function setContent() {	
	if (SPREADSHEET_ID) {
		document.getElementById('loading').style.display = 'block';
		document.getElementById('instructions').style.display = 'none';
		
		setTweets();
	} else {
		document.getElementById('loading').style.display = 'none';
		updateSigninStatus();
	}
}

function setTweets() {
	gapi.client.sheets.spreadsheets.values.batchGet({
	   spreadsheetId: SPREADSHEET_ID,
	   ranges: ['A1:ZZZ1', 'A2:Z']
	}).then(function(response) {
	  var result = response.result;
	  console.log(`${result.valueRanges.length} ranges retrieved.`);

	  document.getElementById('content').innerHTML = '';
	  _GLOBAL.tweets = shuffleByAuthor(result.valueRanges[1].values);

	  setSessionCol(result.valueRanges[0].values);

	  document.getElementById('end-of-list').style.display = 'block';
	  document.getElementById('view-more').style.display = 'block';
	  document.getElementById('loading').style.display = 'none';
	  document.getElementById('instructions').style.display = 'block';
	}, function(reason) {
		if (reason.result.error.status === "PERMISSION_DENIED") {
			handlePageError('Please request access to the google doc')
		} else {
			handlePageError(reason.result.error.message);
		}
	});
}

function setDOM() {
	var content = document.getElementById('content');
	var li;
	var i;
	var tweets = _GLOBAL.tweets;
	var tweet;

	for (i = _GLOBAL.start; i < _GLOBAL.end; i += 1) {
		tweet = tweets[i];
		if (tweet) {
			tweetIndex = parseInt(tweet[0], 10) + 1;

			li = document.createElement('div');
			li.onclick = toggleIsFavorite;
			li.className = 'tweet';
			li.setAttribute('data-fav', _GLOBAL.rowIndexFavs.indexOf(tweetIndex) > -1);
			li.setAttribute('data-fav-plus', _GLOBAL.rowIndexFavsPlus.indexOf(tweetIndex) > -1);
			li.setAttribute('data-index', tweetIndex);
			li.setAttribute('data-id', tweet[ID_INDEX]);

			content.appendChild(li);

			li.innerHTML = '<h2>' + tweet[NAME_INDEX] + '</h2>'
				+ '<h3>@' + tweet[HANDLE_INDEX] + '</h3>'
				+ '<p>' + tweet[TEXT_INDEX] + '</p>'
				+ (tweet[MEDIA_INDEX] && '<img src="' + tweet[MEDIA_INDEX].replace('http://', 'https://') + '"/>')
				+ '<button class="tweet-fav-plus" onclick="toggleIsFavoritePlus(event)"></button>';
		} else {
			document.getElementById('view-more').style.display = 'none';
			break;
		}
	}

	document.getElementById('tweet-count').innerHTML = 'viewing <span class="bold">' 
		+ Math.min(tweets.length, _GLOBAL.end) 
		+ ' / ' 
		+ tweets.length
		+ '</span>'
		+ ' tweets';
}

function getExcelCol(num) {
	for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    	ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
	}

	return ret;
}

function setSessionCol(values) {
	var userColumn = values[0].indexOf('user_' + _GLOBAL.userId);
	var num = userColumn > -1 ? userColumn + 1 : values[0].length + 1;

	_GLOBAL.sessionCol = getExcelCol(num);

	// if new user, add column then set DOM
	if (userColumn === -1 && gapi.auth2.getAuthInstance().isSignedIn) {
		var request = gapi.client.sheets.spreadsheets.values.update({
			spreadsheetId: SPREADSHEET_ID, 
			range: _GLOBAL.sessionCol + 1, 
			valueInputOption: 'USER_ENTERED',
			values: [['user_' + _GLOBAL.userId]]
		});
		request.then(function(response) {

		}, function(reason) {
		  console.error('error: ' + reason.result.error.message);
		  handlePageError(reason.result.error.message);
		});

		setDOM();

	} else if (gapi.auth2.getAuthInstance().isSignedIn) { 
		// else set previous favorites, then set DOM
		setPreviousFavoritesThenDOM();
	} else {
		handlePageError('Please sign in')
	}
}

function setPreviousFavoritesThenDOM() {
	gapi.client.sheets.spreadsheets.values.batchGet({
	   spreadsheetId: SPREADSHEET_ID,
	   ranges: [_GLOBAL.sessionCol + ':' + _GLOBAL.sessionCol] 
	}).then(function(response) {

		response.result.valueRanges[0].values.forEach(function (val, i) {
			if (val[0] == "1" || val[0] === "2") {
				_GLOBAL.rowIndexFavs.push(i + 1);
			}
			if (val[0] == "2") {
				_GLOBAL.rowIndexFavsPlus.push(i + 1);
			}
		});

	  	setDOM();
	}).catch(function(e) {
		if (e.result.error.status === "PERMISSION_DENIED") {
			handlePageError('Please request access to the google doc')
		} else {
			handlePageError(e.result.error.message);
		}
	});
}

function shuffleByAuthor(array) {
	var authors = {};
	array.forEach(function(el, i) {
		if (authors[el[NAME_INDEX]]) {
			authors[el[NAME_INDEX]].push(i)
		} else { 
			authors[el[NAME_INDEX]] = [i];
		}
	})
	var randomizedAuthors = shuffle(Object.keys(authors));
	var tweets = [];
	randomizedAuthors.forEach(function(author) {
		authors[author].forEach(function(index) {
			tweets.push(array[index]);
		})
	})

	return tweets;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function toggleIsFavorite() {
	var isFav = this.getAttribute('data-fav') === 'true';
	var newFav = !isFav;

	this.setAttribute('data-fav', newFav);
	if (!newFav) {
		this.setAttribute('data-fav-plus', false);
	}

	writeToDoc(this);
}

function toggleIsFavoritePlus(e) {
	e.stopPropagation();
	var tweet = e.target.parentNode;
	var isFavPlus = tweet.getAttribute('data-fav-plus') === 'true';
	var newFavPlus = !isFavPlus;

	tweet.setAttribute('data-fav', newFavPlus);
	tweet.setAttribute('data-fav-plus', newFavPlus);

	writeToDoc(tweet);
}

function writeToDoc(el) {
	var isFav = el.getAttribute('data-fav') === 'true';
	var isFavPlus = el.getAttribute('data-fav-plus') === 'true';

	var params = {
		spreadsheetId: SPREADSHEET_ID, 
		range: _GLOBAL.sessionCol + el.getAttribute('data-index'), 
		valueInputOption: 'USER_ENTERED',
		values: [[
			isFavPlus ? 
				'2'
				: isFav ?
					'1'
			: ''
		]]
	};
	var request = gapi.client.sheets.spreadsheets.values.update(params);
	request.then(function(response) {

	}, function(reason) {
	  console.error('error: ' + reason.result.error.message);

	  handlePageError(reason.result.error.message);
	});
}

function viewMore() {
	_GLOBAL.start += 100;
	_GLOBAL.end += 100;
	setDOM();
}

function resetPage () {
	document.body.className = 'not-auth';
	if (document.getElementById('instructions')) {
		document.getElementById('instructions').style.display = 'none';
	}
	document.getElementById('view-more').style.display = 'none';
	document.getElementById('end-of-list').style.display = 'none';
	document.getElementById('content').innerHTML = '';
	_GLOBAL = {
		init: false,
		start: 0,
		end: 100,
		tweets: [],
		userId: new Date().getTime() + '_temp',
		sessionCol: false,
		rowIndexFavs: [],
		rowIndexFavsPlus: []
	};
}

function handlePageError(err) {
	document.getElementById('loading').style.display = 'none';
  	alert(err);
}