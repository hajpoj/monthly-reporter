class WorkItemsController < ApplicationController
  # GET /work_items
  # GET /work_items.json
  def index
    @report = Report.find(params[:report_id])
    @work_items = @report.work_items

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @work_items }
    end
  end

  # GET /work_items/1
  # GET /work_items/1.json
  def show
    @report = Report.find(params[:report_id])
    @work_item = WorkItem.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @work_item }
    end
  end

  # GET /work_items/new
  # GET /work_items/new.json
  def new
    @report = Report.find(params[:report_id])
    @work_item = @report.work_items.build

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @work_item }
    end
  end

  # GET /work_items/1/edit
  def edit
    @report = Report.find(params[:report_id])
    @work_item = WorkItem.find(params[:id])

  end

  # POST /work_items
  # POST /work_items.json
  def create
    @report = Report.find(params[:report_id])
    @work_item = @report.work_items.build(params[:work_item])

    respond_to do |format|
      if @work_item.save
        format.html { redirect_to @report, notice: 'Work item was successfully created.' }
        format.json { render json: @work_item, status: :created, location: [@report, @work_item] }
      else
        format.html { render action: "new" }
        format.json { render json: @work_item.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /work_items/1
  # PUT /work_items/1.json
  def update
    @report = Report.find(params[:report_id])
    @work_item = WorkItem.find(params[:id])

    respond_to do |format|
      if @work_item.update_attributes(params[:work_item])
        format.html { redirect_to @report, notice: 'Work item was successfully updated.' }
        format.json { render json: @work_item, status: :created, location: [@report, @work_item] }
      else
        format.html { render action: "edit" }
        format.json { render json: @work_item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /work_items/1
  # DELETE /work_items/1.json
  def destroy
    @report = Report.find(params[:report_id])
    @work_item = WorkItem.find(params[:id])
    @work_item.destroy

    respond_to do |format|
      format.html { redirect_to @report }
      format.json { head :ok }
    end
  end
end
