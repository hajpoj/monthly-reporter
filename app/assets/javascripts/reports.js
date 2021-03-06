//Place all the behaviors and hooks related to the matching controller here.
//All this logic will automatically be available in application.js.

$(function() {
  var $body = $('body');

  if($body.hasClass('reports show')) {

    var reportController = {

      //***********************************************************************
      // General Init
      //***********************************************************************

      init: function() {
        var self = this;

        self.$workItemsContainer = $('#work-items-data');

        self.initHandlebars();
        self.initSubmitForm();
        self.initRevenueExpense();

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

        self.updateAllStatusTotals();
        self.updateProfit();
      },

      initHandlebars: function() {
        var self = this;
        self.workItemTemplate = Handlebars.compile($('#work-item-template').html());
        self.editWorkItemTemplate = Handlebars.compile($('#edit-work-item-template').html());

        Handlebars.registerHelper('json', function(context) {
          return JSON.stringify(context);
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

      //***********************************************************************
      //Expense Revenue Profit
      //***********************************************************************

      initRevenueExpense: function() {
        var self = this;
        self.$revenueVal = $('#revenue-val');
        self.$revenueFormTD = $('#revenue-form');
        self.$revenueFormButton = self.$revenueFormTD.find('button');

        self.$expenseVal = $('#expense-val');
        self.$expenseFormTD = $('#expense-form');
        self.$expenseFormButton = self.$expenseFormTD.find('button');

        self.$expenseFormButton.on('click', function(e) {
          e.preventDefault();

          var $expenseForm = self.$expenseFormTD.find('form');
          $.ajax({
            type: 'POST',
            url: $expenseForm.attr('action'),
            data: $expenseForm.serialize(),
            dataType: 'json',
            success: function(data) {
              self.$expenseVal.html(data.expense);
              self.toggleMultiple([self.$expenseVal, self.$expenseFormTD]);
              self.updateProfit();
            }
          })
        });

        self.$revenueFormButton.on('click', function(e) {
          e.preventDefault();
          var $revenueForm = self.$revenueFormTD.find('form');

          $.ajax({
            type: 'POST',
            url: $revenueForm.attr('action'),
            data: $revenueForm.serialize(),
            dataType: 'json',
            success: function(data) {
              self.$revenueVal.html(data.revenue);
              self.toggleMultiple([self.$revenueVal, self.$revenueFormTD]);
              self.updateProfit();
            }
          });
        });

        var editRevenueButton = $('a.edit-revenue');
        editRevenueButton.on('click', function(e) {
          e.preventDefault();
          self.toggleMultiple([self.$revenueVal, self.$revenueFormTD]);
        });

        var editExpenseButton = $('a.edit-expense');
        editExpenseButton.on('click', function(e) {
          e.preventDefault();
          self.toggleMultiple([self.$expenseVal, self.$expenseFormTD]);
        });
      },

      toggleMultiple: function(itemsArray) {
        $.each(itemsArray, function(index, item) {
          item.toggle();
        });
      },

      calculateStatusTotals : function(status) {
        var self = this;
        var statusCollection = self.$workItemsContainer.find('.work-item').filter(function(index) {
          return $(this).data('item').status === status;
        });
        return statusCollection.length
      },

      updateStatusTotals: function(status, total) {
        $('#'+status+"-sum").html(total);
      },

      updateAllStatusTotals: function() {
        var self = this;
        var gTotal = self.calculateStatusTotals('Green');
        self.updateStatusTotals('green', gTotal);
        var yTotal = self.calculateStatusTotals('Yellow');
        self.updateStatusTotals('yellow', yTotal);
        var rTotal = self.calculateStatusTotals('Red');
        self.updateStatusTotals('red', rTotal);
        var nTotal = self.calculateStatusTotals('None');
        self.updateStatusTotals('none', nTotal);
      },

      calculateProfit: function() {
        var revenue = $('#revenue-val').html();
        var expense = $('#expense-val').html();
        return revenue - expense;
      },

      updateProfit: function() {
        var self = this;
        var profit = self.calculateProfit();
        $('.profit-val').html(profit);
      },

      //***********************************************************************
      // Edit Work Item
      //***********************************************************************

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
            self.updateAllStatusTotals();
          }
        });
      },

      updateWorkItemSuccess: function(data, $updateDiv) {
        var self = this;
        var html = self.workItemTemplate(data);
        $updateDiv.after(html);
        $updateDiv.remove();
      },

      //***********************************************************************
      // Add New Item
      //***********************************************************************

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

    reportController.init();
  }
});