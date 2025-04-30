use("test")

db.createCollection("student")

db.student.insertMany([

    { username: "user1", password: "pass1", pro_jan:"900", pro_feb:"450", pro_mar:"1100", pro_apr:"700", pro_may:"500", pro_june:"900", pro_jul:"1200", pro_aug:"1000", pro_sep:"2000", pro_oct:"800", pro_nov:"600", pro_dec:"750", impact:"65%"},
    { username: "user2", password: "pass2", pro_jan:"300", pro_feb:"750", pro_mar:"200", pro_apr:"1600", pro_may:"1500", pro_june:"700", pro_jul:"1200", pro_aug:"1000", pro_sep:"1000", pro_oct:"500", pro_nov:"950", pro_dec:"700", impact:"21%" },
    { username: "user3", password: "pass3", pro_jan:"900", pro_feb:"450", pro_mar:"1100", pro_apr:"700", pro_may:"500", pro_june:"900", pro_jul:"1200", pro_aug:"100", pro_sep:"1100", pro_oct:"800", pro_nov:"830", pro_dec:"740", impact:"52%" },
    { username: "user4", password: "pass4" , pro_jan:"900", pro_feb:"450", pro_mar:"1100", pro_apr:"700", pro_may:"500", pro_june:"900", pro_jul:"1200", pro_aug:"430", pro_sep:"1700", pro_oct:"800", pro_nov:"980", pro_dec:"150", impact:"80%"},
    { username: "user5", password: "pass5", pro_jan:"900", pro_feb:"450", pro_mar:"1100", pro_apr:"700", pro_may:"500", pro_june:"900", pro_jul:"1210", pro_aug:"780", pro_sep:"1000", pro_oct:"300", pro_nov:"400", pro_dec:"750", impact:"73%" }
])

db.createCollection("admin")
db.admin.insertOne({ username: "admin", password: "admin" })


db.createCollection("teacher")

db.teacher.insertOne({ username: "faculty1", password: "pass1",total :5, on:2, completed:3, sdg_4 : 30, sgd_9:50, sdg_13:40, positive:70, neu:20, negative:10 })
db.teacher.insertOne({ username: "faculty2", password: "pass2",total :7, on:5, completed:2, sdg_4 : 40, sgd_9:30, sdg_13:30, positive:70, neu:20, negative:10 })


