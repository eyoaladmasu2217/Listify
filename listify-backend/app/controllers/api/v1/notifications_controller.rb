class Api::V1::NotificationsController < ApplicationController
      before_action :authenticate_user!

      # GET /api/v1/notifications
      def index
        @notifications = current_user.notifications
                                     .includes(:actor, :notifiable)
                                     .order(created_at: :desc)
                                     .limit(50)

        render json: format_notifications(@notifications), status: :ok
      end

      # PATCH /api/v1/notifications/:id/read
      def read
        @notification = current_user.notifications.find(params[:id])
        if @notification.update(read_at: Time.current)
          render json: { message: "Notification marked as read" }, status: :ok
        else
          render json: { error: "Failed to update notification" }, status: :unprocessable_entity
        end
      end

      private

      def format_notifications(notifications)
        notifications.map do |notification|
          {
            id: notification.id,
            actor: {
              id: notification.actor.id,
              username: notification.actor.username
            },
            action: notification.action,
            notifiable_type: notification.notifiable_type,
            notifiable_id: notification.notifiable_id,
            read_at: notification.read_at,
            created_at: notification.created_at
          }
        end
      end
end
