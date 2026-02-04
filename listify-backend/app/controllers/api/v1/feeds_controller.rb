module Api
  module V1
    class FeedsController < ApplicationController
      before_action :authenticate_user!

      # GET /api/v1/feed/following
      def following
        activities = Activity.includes(:actor, :target)
                             .where(actor_id: current_user.following_ids)
                             .order(created_at: :desc)
                             .page(params[:page])
                             .per(params[:per] || 20)

        render json: ActivitySerializer.render(activities), status: :ok
      end

      # GET /api/v1/feed/explore
      def explore
        activities = Activity.includes(:actor, :target)
                             .where.not(actor_id: current_user.id)
                             .order(created_at: :desc)
                             .page(params[:page])
                             .per(params[:per] || 20)

        render json: ActivitySerializer.render(activities), status: :ok
      end
    end
  end
end
