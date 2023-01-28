# frozen_string_literal: true

class BotController < ApplicationController
  class Unauthorized < StandardError; end

  rescue_from Unauthorized, Aws::SESV2::Errors::AccessDeniedException do
    render json: { error: :unauthorized }, status: :unauthorized
  end

  def version
    render json: { revision: ENV.fetch('REVISION', 'dev') }
  end

  def debug
    raise Unauthorized unless ENV['DEBUG_TOKEN'] == params['_token']

    NotificationMailer.debug.deliver_now
    render json: { ok: true }
  end
end
