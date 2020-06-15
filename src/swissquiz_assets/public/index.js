import swissquiz from 'ic:canisters/swissquiz';

swissquiz.greet(window.prompt("Enter your name:")).then(greeting => {
  window.alert(greeting);
});
