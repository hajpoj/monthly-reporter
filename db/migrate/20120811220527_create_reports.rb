class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.integer :month
      t.integer :year
      t.integer :revenue
      t.integer :expense
      t.text :note
      t.integer :project_id

      t.timestamps
    end
  end
end
