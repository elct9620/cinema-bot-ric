# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: ENV['MAILER__FROM']
  layout 'mailer'

  after_action :set_tracker_headers

  private

  def set_tracker_headers
    headers['X-SES-CONFIGURATION-SET'] = ENV['MAILER__CONFIGURATION_SET']
  end
end
