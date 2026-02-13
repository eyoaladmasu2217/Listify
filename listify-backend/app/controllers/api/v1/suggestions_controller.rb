module Api
  module V1
    class SuggestionsController < ApplicationController
      # Authentication is handled by ApplicationController
      
      # GET /api/v1/suggestions/users
      def users
        limit = params[:limit]&.to_i || 5
        suggested_users = User.suggestions_for(current_user, limit: limit)
        
        render json: UserSerializer.render_as_json(suggested_users, view: :simple), status: :ok
      end
    end
  end
end
