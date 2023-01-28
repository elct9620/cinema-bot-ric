# frozen_string_literal: true

class BotController < ApplicationController
  class Unauthorized < StandardError; end

  rescue_from Unauthorized do
    render json: { error: :unauthorized }, status: :unauthorized
  end

  def version
    render json: { revision: ENV.fetch('REVISION', 'dev') }
  end

  def debug
    raise Unauthorized unless ENV['DEBUG_TOKEN'] == params['_token']

    NotificationMailer.debug.deliver_now
  end
end
