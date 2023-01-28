# frozen_string_literal: true

class NotificationMailer < ApplicationMailer
  def debug
    mail(to: ENV['ADMIN_MAIL'], subject: "DEBUG #{ENV['REVISION']}")
  end
end
