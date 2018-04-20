// Client ID and API key from the Developer Console
var CLIENT_ID = '862223329657-bar3022h3fnatd79fqdij5id486r41ee.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDVapsalARhIRw676I30xXZ9OW2wzlFrC4';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    signoutButton.onclick = handleSignoutClick;

  }).catch(e=>{
    console.log("error:", e);
  })

  checkLogIn();
}

function checkLogIn() {
    setTimeout(function() {
      if (!_GLOBAL.init) {
        var isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        updateSigninStatus(isSignedIn);
        if (!isSignedIn) {
          //handlePageError('Could not authenticate')
          checkLogIn();
        }
      } 
    }, 5000);
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    _GLOBAL.userId = gapi.auth2.getAuthInstance().currentUser.Ab.El;
    _GLOBAL.init = true;
    document.body.className = '';
    document.getElementById('content').style.display = 'block';
    authorizeButton.style.display = 'inline-block';
    signoutButton.style.display = 'inline-block';
    document.getElementById('loading').style.display = 'none';

    if (document.getElementById('topics')) {
      document.getElementById('topics').style.display = 'block';
    } else {
      setContent();
    }
  } else {
    document.body.className = 'not-auth';
    authorizeButton.style.display = 'inline-block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  resetPage();
}