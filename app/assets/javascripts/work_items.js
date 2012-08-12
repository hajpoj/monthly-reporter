//Place all the behaviors and hooks related to the matching controller here.
//All this logic will automatically be available in application.js.

$(function() {
  var $body = $('body');

  if($body.hasClass('reports show')) {
    var $showForm = $('#new-work-item');
    var $form = $('#new-work-item-form');
    var $formSubmit = $form.find('.btn');
    var $workItems = $('#work-items');
    var editTemplate = Handlebars.compile($('#work-item-edit-template').html());

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
          $workItems.append(html);
        }
      });
    });

    $workItems.on('click', '.edit.btn', function(e) {
      e.preventDefault();

      var $this = $(this);
      var $workItemRow = $this.closest('.row');
      var $description = $workItemRow.find('.desc.span10');

      var html = editTemplate({
        description: $workItemRow.attr('data-desc'),
        id: $workItemRow.attr('data-id'),
        reportId: $workItemRow.attr('data-report-id')
      });
      $description.hide();
      $workItemRow.prepend(html);
    });

    $workItems.on('click', '.update-item', function(e) {
      e.preventDefault();

      var $updateForm = $(this).closest('form');
      var $workItemRow = $(this).closest('.row');
      var $updateAction = $updateForm.attr('action');

      $.ajax({
        type: 'POST',
        url: $updateAction,
        data: $updateForm.serialize(),
        dataType: 'json',
        success: function(data) {
          console.log(data);
          var $description = $workItemRow.find('.desc.span10');
          $description.html(data.description);
          $description.show();
          $updateForm.parent().remove();
          $workItemRow.attr('data-desc', data.description);
        }
      });
    });
  }
});