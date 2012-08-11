class CreateWorkItems < ActiveRecord::Migration
  def change
    create_table :work_items do |t|
      t.text :description
      t.string :status
      t.text :comment
      t.integer :report_id

      t.timestamps
    end
  end
end
