var books = [];


$('.search').on('click', function () {
  var search = $('#search-query').val();
  
  fetch(search);
 
});

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
  $.ajax({
    method: "GET",
    url: "https://www.googleapis.com/books/v1/volumes?q=" + query,
    dataType: "json",
    success: function(data) {
      addBooks(data);
      $('#spinner').hide();
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
