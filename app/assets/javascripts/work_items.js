//Place all the behaviors and hooks related to the matching controller here.
//All this logic will automatically be available in application.js.

$(function() {
  var $body = $('body');

  if($body.hasClass('reports show')) {
    var $showForm = $('#new-work-item');
    var $form = $('#new-work-item-form');
    var $formSubmit = $form.find('.btn');
    var $workItemsTable = $('#work-items');

    $showForm.on('click', function(e) {
      e.preventDefault();
      $form.slideToggle(100);
    });

    $formSubmit.on('click', function(e) {
      e.preventDefault();
      var $formAction = $form.attr('action');
      $.ajax({
        type: 'POST',
        url: $formAction,
        data: $form.serialize(),
        dataType: 'json',
        success: function(data) {
          console.log(data);
          var source = $('#work-item-template').html();
          var template = Handlebars.compile(source);
          var html = template(data);
          $workItemsTable.append(html);
        }
      });
    });
  }
});