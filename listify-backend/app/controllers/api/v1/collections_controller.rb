module Api
  module V1
    class CollectionsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_collection, only: [ :add_item, :remove_item ]

      # POST /api/v1/collections
      def create
        collection = current_user.collections.build(collection_params)
        if collection.save
          render json: { id: collection.id, title: collection.title, public: collection.public }, status: :created
        else
          render json: { error: collection.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/collections/:id/items
      # Body: { song_id: 123 }
      def add_item
        song = Song.find_by(id: params[:song_id])
        unless song
            render json: { error: "Song not found" }, status: :not_found
            return
        end

        item = @collection.collection_items.build(song: song)
        if item.save
          render json: { collection_id: item.collection_id, song_id: item.song_id, position: item.position }, status: :created
        else
          # Handle duplicate error gracefully
          render json: { error: item.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/collections/:id/items/:song_id
      def remove_item
        # Find item by song_id within this collection
        item = @collection.collection_items.find_by(song_id: params[:song_id])

        if item
          item.destroy
          render json: { message: "Song removed from collection" }, status: :ok
        else
          render json: { error: "Song not found in this collection" }, status: :not_found
        end
      end

      private

      def collection_params
        params.require(:collection).permit(:title, :description, :public)
      end

      def set_collection
        # Enforce ownership: only find collections belonging to current_user
        @collection = current_user.collections.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Collection not found or access denied" }, status: :not_found
      end
    end
  end
end
