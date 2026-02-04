module Api
  module V2
    class FeedController < ApplicationController
      before_action :authenticate_user!

      # GET /api/v2/feed/following
      def following
        activities = fetch_activities(current_user.following_ids)
        render json: ActivitySerializer.render(activities), status: :ok
      end

      # GET /api/v2/feed/explore
      def explore
        activities = Activity.includes(:actor, :target)
                             .where.not(actor_id: current_user.id)
                             .order(created_at: :desc)
                             .limit(20)

        # Paginated with basic limit for now
        render json: ActivitySerializer.render(activities), status: :ok
      end

      private

      def fetch_activities(actor_ids)
        Activity.includes(:actor, :target)
                .where(actor_id: actor_ids)
                .order(created_at: :desc)
                .limit(20)
      end
    end
  end
end
