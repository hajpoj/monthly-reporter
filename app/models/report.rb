class Report < ActiveRecord::Base
  belongs_to :project
  has_many :work_items
  before_save :add_default_revenue_expense

  attr_accessible :month, :year, :project, :project_id, :revenue, :expense, :note

  MONTHS = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  }

  YEARS = [ 2012, 2013, 2014, 2015 ]

  validates :project, presence: true
  validates :month, presence: true, inclusion: {in: MONTHS.values}
  validates :year, presence: true, inclusion: {in: YEARS}

  def add_default_revenue_expense
    if self.revenue.nil?
      self.revenue = 0
    end

    if self.expense.nil?
      self.expense = 0
    end
  end

end
