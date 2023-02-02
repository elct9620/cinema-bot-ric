# frozen_string_literal: true

class BotController < ApplicationController
  class Unauthorized < StandardError; end

  rescue_from Unauthorized do
    render json: { error: :unauthorized }, status: :unauthorized
  end

  def version
    render json: { revision: ENV.fetch('REVISION', 'dev') }
  end
end
