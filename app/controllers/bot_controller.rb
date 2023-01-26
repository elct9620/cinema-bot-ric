# frozen_string_literal: true

class BotController < ApplicationController
  def version
    render json: { revision: ENV.fetch('REVISION', 'dev') }
  end
end
