const send_success = (res, data, message = 'Success', status_code = 200) => {
  return res.status(status_code).json({
    success: true,
    message,
    data
  });
};

const send_error = (res, message = 'Error occurred', status_code = 400, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(status_code).json(response);
};

module.exports = {
  send_success,
  send_error
};
