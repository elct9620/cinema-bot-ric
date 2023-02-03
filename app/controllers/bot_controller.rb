# frozen_string_literal: true

class BotController < ApplicationController
  class Unauthorized < StandardError; end

  rescue_from Unauthorized do
    render json: { error: :unauthorized }, status: :unauthorized
  end

  def version
    render json: { revision: ENV.fetch('REVISION', 'dev') }
  end

  def webhook
    body = request.body.read
    signature = request.env['HTTP_X_LINE_SIGNATURE']
    render json: {}, status: :bad_request unless client.validate_signature(body, signature)

    events = client.parse_events_from(body)
    events.each do |event|
      client.reply_message(event['replyToken'], 'PONG!')
    end

    head :no_content
  end

  private

  def client
    @client ||= Line::Bot::Client.new do |c|
      c.channel_id = config[:channel_id]
      c.channel_secret = config[:channel_secret]
      c.channel_token = config[:channel_token]
    end
  end

  def config
    Rails.application.config_for(:line)
  end
end
