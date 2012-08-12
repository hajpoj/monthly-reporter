class Project < ActiveRecord::Base
  has_many :reports

  attr_accessible :name
  validates :name, presence: true

end
