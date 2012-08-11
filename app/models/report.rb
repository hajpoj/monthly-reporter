class Report < ActiveRecord::Base
  belongs_to :project
  has_many :work_items
end
