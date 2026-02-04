class Activity < ApplicationRecord
  belongs_to :target, polymorphic: true
  belongs_to :actor, class_name: "User"
end
