# frozen_string_literal: true

module Queries
  class Levels < Queries::BaseQuery
    type [Types::DungeonsAndDragons::Level], null: false

    def resolve
      ::Level.order(:level)
    end
  end
end
