class UpdateRevenueExpense < ActiveRecord::Migration
  def change
    change_column :reports, :revenue, :integer, default: 0, null: false
    change_column :reports, :expense, :integer, default: 0, null: false
  end
end
