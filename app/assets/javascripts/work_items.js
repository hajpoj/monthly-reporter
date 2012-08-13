//Place all the behaviors and hooks related to the matching controller here.
//All this logic will automatically be available in application.js.

$(function() {
  var $body = $('body');

  if($body.hasClass('reports show')) {

    var workItemsController = {

      init: function() {
        var self = this;

        self.$workItemsContainer = $('#work-items-data');
        self.initHandlebars();
        self.initSubmitForm();

        //display the current list of work items
        self.initialDisplay();

        //Add event listener for edit work item button
        self.$workItemsContainer.on('click', '.edit.btn', function(e) {
          self.editWorkItem.call(self, e);
        });

        //Add event listener for updating work item button
        self.$workItemsContainer.on('click', '.update-item', function(e) {
          self.updateWorkItem.call(self, e);
        });
      },

      initHandlebars: function() {
        var self = this;
        self.workItemTemplate = Handlebars.compile($('#work-item-template').html());
        self.editWorkItemTemplate = Handlebars.compile($('#edit-work-item-template').html());

        Handlebars.registerHelper('json', function(context) {
          return JSON.stringify(context);
        });
      },

      initSubmitForm: function () {
        var self = this;
        self.$showFormButton = $('#new-work-item');
        self.$form = $('#new-work-item-form');
        self.$formSubmitButton = self.$form.find('.btn');

        self.$showFormButton.on('click', function(e) {
          e.preventDefault();
          self.$form.slideToggle(100);
        });

        self.$formSubmitButton.on('click', function(e) {
          self.addNewWorkItem.call(self, e);
        });
      },

      initialDisplay: function() {
        var self = this;
        var data = self.$workItemsContainer.data('workitems');
        var $data = $(data);

        $data.each(function(index, workItem) {
          var html = self.workItemTemplate(workItem);
          self.$workItemsContainer.append(html);
        });
      },

      editWorkItem: function(e) {

        e.preventDefault();
        var $target = $(e.target);
        var self = this;
        var $workItem = $target.closest('.work-item');
        var $data = $workItem.data('item');
        var html = self.editWorkItemTemplate($data);

        $workItem.after(html);
        $workItem.remove();

        self.$workItemsContainer.find("option:[value="+$data.status+"]").attr('selected', 'true');
      },

      updateWorkItem: function(e) {
        e.preventDefault();

        var $target = $(e.target);
        var self = this;
        var $updateDiv = $target.closest('.edit-work-item');
        var $updateForm = $target.closest('form');

        $.ajax({
          type: 'POST',
          url:  $updateForm.attr('action'),
          data: $updateForm.serialize(),
          dataType: 'json',
          success: function(data) {
            self.updateWorkItemSuccess.call(self, data, $updateDiv);
          }
        });
      },

      updateWorkItemSuccess: function(data, $updateDiv) {
        var self = this;
        var html = self.workItemTemplate(data);
        $updateDiv.after(html);
        $updateDiv.remove();
      },

      addNewWorkItem: function(e) {
        e.preventDefault();
        var self = this;

        $.ajax({
          type: 'POST',
          url: self.$form.attr('action'),
          data: self.$form.serialize(),
          dataType: 'json',
          success: function(data) {
            self.addNewWorkItemSuccess.call(self, data);
          }
        });
      },

      addNewWorkItemSuccess: function(data) {
        var self = this;
        var $textarea = self.$form.find('.description-field');
        var html = self.workItemTemplate(data);
        self.$workItemsContainer.append(html);

        $textarea.focus().select();
      }
    };
    workItemsController.init();
  }
});