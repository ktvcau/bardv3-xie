module.exports.config = {
  name: "bardv3",
  version: "1.0.2", // Sửa phiên bản thành 1.0.2
  hasPermission: 0,
  credits: "XIE",
  description: "Tìm ảnh",
  commandCategory: "AI",
  usages: ["bardv3 + [văn bản]"],
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require("fs-extra");

  const keySearch = args.join(" ");
  if (!keySearch.includes("-")) return api.sendMessage('Xie gợi ý!\nVí dụ sử dụng như: =bardv3 Xieloli -10', event.threadID, event.messageID);

  api.sendMessage("⏳ Đang tạo ảnh cho bạn...", event.threadID, event.messageID);

  const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
  const numberSearch = keySearch.split("-").pop() || 6;

  try {
    const res = await axios.get(`https://free-api.ainz-sama101.repl.co/others/genimg?prompt=${encodeURIComponent(keySearchs)}`);
    const data = res.data.result;

    var num = 0;
    var imgData = [];

    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      const getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }

    api.sendMessage({
      attachment: imgData,
      body: "Tổng số ảnh: " + data.length + "\nSố " + numberSearch + " ảnh được tạo cho " + keySearchs + "\nTạo bởi trí tuệ nhân tạo"
    }, event.threadID, event.messageID);

    for (let ii = 1; ii <= parseInt(numberSearch); ii++) {
      fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    api.sendMessage("Có lỗi xảy ra trong quá trình tạo ảnh. Vui lòng thử lại sau.", event.threadID, event.messageID);
  }
};
