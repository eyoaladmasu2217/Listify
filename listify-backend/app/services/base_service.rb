require "ostruct"

class BaseService
  def self.call(*args, &block)
    new(*args, &block).call
  end

  def success(data = nil)
    OpenStruct.new(success?: true, data: data, errors: [])
  end

  def failure(errors = [])
    OpenStruct.new(success?: false, data: nil, errors: Array(errors))
  end
end
