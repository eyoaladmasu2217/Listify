module Api
  module V1
    class CollectionsController < ApplicationController
      # Authentication is handled by ApplicationController's authenticate_request!
      before_action :set_collection, only: [ :show, :add_item, :remove_item, :update, :destroy ]

      # GET /api/v1/collections
      def index
        collections = current_user.collections.order(created_at: :desc)
        render json: CollectionSerializer.render_as_json(collections), status: :ok
      end

      # GET /api/v1/collections/:id
      def show
        render json: CollectionSerializer.render_as_json(@collection), status: :ok
      end

      # POST /api/v1/collections
      def create
        collection = current_user.collections.build(collection_params)
        if collection.save
          render json: { id: collection.id, title: collection.title, public: collection.public }, status: :created
        else
          render json: { error: collection.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/collections/:id
      def update
        if @collection.update(collection_params)
          render json: { id: @collection.id, title: @collection.title, description: @collection.description, public: @collection.public }, status: :ok
        else
          render json: { error: @collection.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/collections/:id
      def destroy
        @collection.destroy
        render json: { message: "Collection deleted successfully" }, status: :ok
      end

      # POST /api/v1/collections/:id/items
      # Body: { song_id: 123 } OR { album_id: 456 }
      def add_item
        if params[:song_id].present?
          song = Song.find_by(id: params[:song_id])
          unless song
            render json: { error: "Song not found" }, status: :not_found
            return
          end
          item = @collection.collection_items.build(song: song)
        elsif params[:album_id].present?
          album = Album.find_by(id: params[:album_id])
          unless album
            render json: { error: "Album not found" }, status: :not_found
            return
          end
          item = @collection.collection_items.build(album: album)
        else
          render json: { error: "Must provide song_id or album_id" }, status: :unauthorized
          return
        end

        if item.save
          render json: { collection_id: item.collection_id, song_id: item.song_id, album_id: item.album_id, position: item.position }, status: :created
        else
          render json: { error: item.errors.full_messages.to_sentence }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/collections/:id/items
      # Body: { song_id: 123 } OR { album_id: 456 }
      def remove_item
        if params[:song_id].present?
          item = @collection.collection_items.find_by(song_id: params[:song_id])
        elsif params[:album_id].present?
          item = @collection.collection_items.find_by(album_id: params[:album_id])
        else
          render json: { error: "Must provide song_id or album_id" }, status: :unprocessable_entity
          return
        end

        if item
          item.destroy
          render json: { message: "Item removed from collection" }, status: :ok
        else
          render json: { error: "Item not found in this collection" }, status: :not_found
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
