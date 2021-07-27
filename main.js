var books = [];
var index = 0; //add 10 each time the next button is used. subtract 10 for back button. Check to see if index is zero, in which case back button doesn't work.


//search
$('.search').on('click', function () {   
  var search = $('#search-query').val() +'&startIndex=' + index;
  
  fetch(search); 
});

var checkPrev = function() {
  if (index < 10) {
    $('#prev10').hide();
  } else {
    $('#prev10').css('display', 'inline-block');
  }
};

//load next 10 results
$('#next10').on('click', function () {
  index += 10;
  var search = $('#search-query').val() +'&startIndex=' + index;
  fetch(search);

  checkPrev();
});

//load previous 10 results
$('#prev10').on('click', function (){
 index -= 10;

 var search = $('#search-query').val() +'&startIndex=' + index;
fetch(search);

  checkPrev();
})

//show and hide the loading spinner/button/whatever I settle on
$(document).on({
  ajaxStart: function(){
    $('.search').hide();
    $('#spin').show();
  },
  ajaxStop: function(){
    $('.search').show();
    $('#spin').hide();
  }
});

var addBooks = function(data) {
  books = [];

  console.log(data.items);
  for (let i = 0; i < data.items.length; i++) {
    

    const element = data.items[i];
    var bookInfo = {
      title: element.volumeInfo.title || null, 
      author: element.volumeInfo.authors ? element.volumeInfo.authors[0]: null, 
      imageURL: element.volumeInfo.imageLinks ? element.volumeInfo.imageLinks.thumbnail : null, isbn: element.volumeInfo.industryIdentifiers ? element.volumeInfo.industryIdentifiers[0].identifier: null,
      pageCount: element.volumeInfo.pageCount || null};    
    
    books.push(bookInfo);    
  }
  renderBooks();
};

var fetch = function (query) {
  //add start index
  $.ajax({
    method: "GET",
    url: "https://www.googleapis.com/books/v1/volumes?q=" + query,
    dataType: "json",
    startIndex: index,
    success: function(data) {
      addBooks(data);
      $('#spinner').hide();
      //show more results links/buttons
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var renderBooks = function () {
  $('.books').empty();

  for (let i = 0; i < books.length; i++) {
    const element = books[i];
    var source = $('#book-template').html();
    var template = Handlebars.compile(source);
    var newBook = template(element);
    
    $('.books').append(newBook);
}
};
