function handleSuccess(res, data) {
	// send傳入型別來決定回傳格式
	// String => HTML <h1>Hello</h1>
	// Array or Object => JSON

	// 兩種寫法都可
	res.status(200).json({
		status: 'success',
		data,
	});

	/*
  res.send({
    status: true,
    data
  }).end();
  */
}

module.exports = handleSuccess;
