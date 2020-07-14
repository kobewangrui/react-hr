import request from '../utils/request'

// require('./mock') //是否使用mock数据

export default {
	PUT: req => request.put(req.url, req.data),
	GET: req => request.get(req.url, req.data),
	POST: req => request.post(req.url, req.data),
	DELETE: req => request.delete(req.url, req.data),
}
