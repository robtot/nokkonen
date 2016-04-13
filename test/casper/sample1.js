casper.test.begin('Test Website Functioning', 1, function(test) {
  casper.start('http://localhost:3000', function() {
    test.assertTitle('Nokkonen', 'Landing title is "Nokkonen" as expected');
  });

  casper.run(function() {
    test.done();
  });

});
