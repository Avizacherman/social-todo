module.exports = {
  failure: function(response, msg){
    return {data: response, msg, success: false}
  },
  success: function(response, msg){
    return {data: response, msg, success: true}
  }
}
