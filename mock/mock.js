// fake数据
module.exports = function(){
  const faker =require("faker");
  const _ = require("lodash");
  return {
    //rest接口 https://github.com/marak/Faker.js/
    people: _.times(100,function (n) {
      return {
        id: n,
        name: faker.name.findName(),
        avatar: faker.internet.avatar()
      }
    }),
    detail: _.times(10,function (n) {
      return {
        id: n,
        name: faker.name.findName(),
        avatar: faker.internet.avatar()
      }
    })
  }
}
