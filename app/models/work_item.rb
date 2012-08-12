class WorkItem < ActiveRecord::Base
  belongs_to :report
  before_validation :add_default_status

  module Status
    NONE = 'None'
    GREEN = 'Green'
    YELLOW = 'Yellow'
    RED = 'Red'
  end
  STATUS = [ Status::NONE, Status::GREEN, Status::YELLOW, Status::RED]

  attr_accessible :description, :status, :comment, :report, :report_id

  validates :status, inclusion: {in: STATUS}
  validates :description, presence: true
  validates :report, presence: true

  def add_default_status
    if self.status.nil?
      self.status = Status::NONE
    end
  end
end
