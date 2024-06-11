const mongoose = require("mongoose");

module.exports = async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    await mongoose.connect("mongodb://svc.sel5.cloudtype.app:31953", {
      dbName: "db", // 실제로 data 저장할 db
    });
    console.log("몽고디비 연결 성공");
  } catch (error) {
    console.error("몽고디비 연결 에러", error);
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    console.log("몽고디비에 연결되었습니다.");
  });

  mongoose.connection.on("error", (err) => {
    console.log("몽고디비 연결 에러", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.");
  });

  require("./User");
  require("./Board");
  require("./Comment");
};
