_GLOBAL = {
	init: false,
	start: 0,
	end: 100,
	tweets_all: [],
	tweets: [],
	tweetsByAuthor: {},
	tweetIndexDictionary: {},
	authorsAlreadySeen: [],
	userId: new Date().getTime() + '_temp',
	sessionCol: false,
	rowIndexFavs: [],
	rowIndexFavsPlus: []
};

function setContent() {	
	if (SPREADSHEET_ID) {
		document.getElementById('loading').style.display = 'block';
		
		setTweetsArray();
	} else {
		document.getElementById('loading').style.display = 'none';
		updateSigninStatus();
	}
}

function setTweetsArray() {
	gapi.client.sheets.spreadsheets.values.batchGet({
	   spreadsheetId: SPREADSHEET_ID,
	   ranges: ['A1:ZZZ1', 'A2:Z']
	}).then(function(response) {
	  var result = response.result;
	  console.log(`${result.valueRanges.length} ranges retrieved.`);

	  document.getElementById('content').innerHTML = '';

	  _GLOBAL.tweets = result.valueRanges[1].values;
	  setTweetMetaData(_GLOBAL.tweets);
	  setSessionColThenSetDOM(result.valueRanges[0].values);
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

  	document.getElementById('end-of-list').style.display = 'block';
  	document.getElementById('search').style.display = 'block';
  	document.getElementById('view-more').style.display = 'block';
  	document.getElementById('loading').style.display = 'none';

	for (i = _GLOBAL.start; i < _GLOBAL.end; i += 1) {
		tweet = tweets[i];
		if (tweet) {
			tweetIndex = _GLOBAL.tweetIndexDictionary[tweet[ID_INDEX]];

			li = document.createElement('div');
			li.onclick = toggleIsFavorite;
			li.className = 'tweet';
			li.setAttribute('data-fav', _GLOBAL.rowIndexFavs.indexOf(tweetIndex) > -1);
			li.setAttribute('data-fav-plus', _GLOBAL.rowIndexFavsPlus.indexOf(tweetIndex) > -1);
			li.setAttribute('data-index', tweetIndex);
			li.setAttribute('data-id', tweet[ID_INDEX]);

			li.innerHTML = '<h2>' + tweet[NAME_INDEX] + '</h2>'
				+ '<h3>@' + tweet[HANDLE_INDEX] + '</h3>'
				+ '<p>' + tweet[TEXT_INDEX] + '</p>'
				+ (tweet[MEDIA_INDEX] && '<img src="' + tweet[MEDIA_INDEX].replace('http://', 'https://') + '"/>')
				+ '<button class="tweet-fav-plus" onclick="toggleIsFavoritePlus(event)"></button>';

			content.appendChild(li);
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

function setSessionColThenSetDOM(values) {
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
		  if (reason.result.error.status === 'PERMISSION_DENIED') {
		  	document.getElementById('content').style.display = 'none';
		  	document.getElementById('end-of-list').style.display = 'none';
		  	document.getElementById('search').style.display = 'none';
		  }
		});

		_GLOBAL.tweets = shuffleByAuthor(_GLOBAL.tweets)
		_GLOBAL.tweets_all = _GLOBAL.tweets.slice();

		setDOM();

	} else if (gapi.auth2.getAuthInstance().isSignedIn) { 
		// else set previous favorites, then set DOM
		setPreviousFavoritesThenSetDOM();
	} else {
		handlePageError('Please sign in')
	}
}

function filterTweets(input) {
	input = input.trim();
	var searchTerms = input.toLowerCase().split(' ');
	var containsAll;
	var legislator;
	var text;

	var filteredTweets = _GLOBAL.tweets_all.slice().filter(function(tweet) {
		containsAll = true;

		legislator = tweet[NAME_INDEX].toLowerCase();
		text = tweet[TEXT_INDEX].toLowerCase();

		searchTerms.forEach(function(term) {
			if (legislator.indexOf(term) === -1 && text.indexOf(term) === -1) {
				containsAll = false;
			}
		});

		return containsAll;
 	});

	if (input.length > 0) {
		document.getElementById('search-clear').style.display = 'block';
	} else {
		document.getElementById('search-clear').style.display = 'none';
	}

 	document.getElementById('content').innerHTML = '';

 	_GLOBAL.tweets = filteredTweets;
 	_GLOBAL.start = 0;
 	_GLOBAL.end = 100;
 	setDOM();
}

function clearSearch() {
	document.getElementById('search-input').value = '';
	filterTweets('');
}

function setPreviousFavoritesThenSetDOM() {
	var author; 

	gapi.client.sheets.spreadsheets.values.batchGet({
	   spreadsheetId: SPREADSHEET_ID,
	   ranges: ['A2:' + _GLOBAL.sessionCol] 
	}).then(function(response) {

		response.result.valueRanges[0].values.forEach(function (val, i) {
			if (val[val.length-1] == "1" || val[val.length-1] === "2") {
				_GLOBAL.rowIndexFavs.push(i + 2);
				author = val[NAME_INDEX];
				if (_GLOBAL.authorsAlreadySeen.indexOf(author) === -1) {
					_GLOBAL.authorsAlreadySeen.push(author);
				}
			}
			if (val[val.length-1] == "2") {
				_GLOBAL.rowIndexFavsPlus.push(i + 2);
			}
		});

		_GLOBAL.tweets = shuffleByAuthor(_GLOBAL.tweets);
		_GLOBAL.tweets_all = _GLOBAL.tweets.slice();

	  	setDOM();
	}).catch(function(e) {
		if (e.result.error.status === "PERMISSION_DENIED") {
			handlePageError('Please request access to the google doc')
		} else {
			handlePageError(e.result.error.message);
		}
	});
}

function setTweetMetaData(array) {
	var authors = {};
	var d = {};
	array.forEach(function(el, i) {
		if (authors[el[NAME_INDEX]]) {
			authors[el[NAME_INDEX]].push(i)
		} else { 
			authors[el[NAME_INDEX]] = [i];
		}
		d[el[ID_INDEX]] = i + 2;
	})

	_GLOBAL.tweetIndexDictionary = d;
	_GLOBAL.tweetsByAuthor = authors;
}

function shuffleByAuthor(array) {
	var randomizedAuthors = shuffle(Object.keys(_GLOBAL.tweetsByAuthor));
	var tweets = [];

	//give priority if author not already seen (no tweets by author favorited)
	if (_GLOBAL.authorsAlreadySeen.length > 0) {
		randomizedAuthors.sort(function(a, b) {
			return _GLOBAL.authorsAlreadySeen.indexOf(a) > -1 ? 1 : 0;
		});
	}

	randomizedAuthors.forEach(function(author) {
		_GLOBAL.tweetsByAuthor[author].forEach(function(index) {
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
	var tweetIndex = parseInt(this.getAttribute('data-index'), 10);

	this.setAttribute('data-fav', newFav);
	if (!newFav) {
		this.setAttribute('data-fav-plus', false);
		_GLOBAL.rowIndexFavs.splice(_GLOBAL.rowIndexFavs.indexOf(tweetIndex), 1);
		if (_GLOBAL.rowIndexFavsPlus.indexOf(tweetIndex) > -1) {
			_GLOBAL.rowIndexFavsPlus.splice(_GLOBAL.rowIndexFavsPlus.indexOf(tweetIndex), 1);
		}
	} else {
		_GLOBAL.rowIndexFavs.push(tweetIndex);
	}

	writeToDoc(this);
}

function toggleIsFavoritePlus(e) {
	e.stopPropagation();
	var tweet = e.target.parentNode;
	var isFavPlus = tweet.getAttribute('data-fav-plus') === 'true';
	var newFavPlus = !isFavPlus;
	var tweetIndex = parseInt(tweet.getAttribute('data-index'), 10);

	tweet.setAttribute('data-fav', newFavPlus);
	tweet.setAttribute('data-fav-plus', newFavPlus);

	if (newFavPlus) {
		_GLOBAL.rowIndexFavsPlus.push(tweetIndex);
		if (_GLOBAL.rowIndexFavs.indexOf(tweetIndex) === -1) {
			_GLOBAL.rowIndexFavs.push(tweetIndex);
		}
	} else {
		if (_GLOBAL.rowIndexFavsPlus.indexOf(tweetIndex) > -1) {
			_GLOBAL.rowIndexFavsPlus.splice(_GLOBAL.rowIndexFavsPlus.indexOf(tweetIndex), 1);
		}
		if (_GLOBAL.rowIndexFavs.indexOf(tweetIndex) > -1) {
			_GLOBAL.rowIndexFavs.splice(_GLOBAL.rowIndexFavs.indexOf(tweetIndex), 1);
		}
	}

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
	document.getElementById('view-more').style.display = 'none';
	document.getElementById('end-of-list').style.display = 'none';
	document.getElementById('search').style.display = 'none';
	document.getElementById('content').innerHTML = '';
	_GLOBAL = {
		init: false,
		start: 0,
		end: 100,
		tweets_all: [],
		tweets: [],
		tweetsByAuthor: {},
		tweetIndexDictionary: {},
		authorsAlreadySeen: [],
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