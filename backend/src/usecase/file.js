const multer = require("multer");
const repo = require("../repo/file");
const queueRepo = require("../repo/queue");
const fileSystem = require("fs");
const path = require("path");
const permit = require("../handle/middlewere/permit");
const errExep = require("../errExep");
// กำหนดตำแหน่งและชื่อไฟล์ตอนบันทึก
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, unique + "." + ext);
  },
});

const upload = multer({ storage });

exports.single = (part) => { return upload.single(part); }

exports.upload = async (auth_id,queue_id, originalname, filename, mimetype, size) => {
  const queue = await queueRepo.get_by_id(queue_id);
  if (queue.length === 0) {
    throw new Error(errExep.QUEUE_NOT_FOUND);
  }
  if (queue[0].auth_id !== auth_id && auth_id !== 0) {
    throw new Error(errExep.NO_PERMISSION_UPLOAD_FILE);
  }
  const file_id = await repo.create(queue_id, originalname, filename, mimetype, size);
  return { file_id, file_url: "/file/" + filename };
}

exports.listing = async (queue_id) => {
  return await repo.listing(queue_id);
}
exports.delete_by_id = async (auth_id,file_id) => {
  const queue = await queueRepo.get_by_id(queue_id);
  if (queue.length === 0) {
    throw new Error(errExep.QUEUE_NOT_FOUND);
  }
  if (queue[0].auth_id !== auth_id && auth_id !== 0) {
    throw new Error(errExep.NO_PERMISSION_DELETE_FILE);
  }
  const file = await repo.get_by_id(file_id);
  if (file.length === 0) {
    throw new Error(errExep.FILE_NOT_FOUND);
  }
  await repo.delete_by_id(file_id);
  const path = "files/" + file[0].file_name;
  fileSystem.unlink(path, (err) => {
    if (err) {
      throw new Error(errExep.FILE_DELETE_FAIL);
    }
  });
  console.log(path);
}

exports.get_by_id = async (file_id) => {
  const result = await repo.get_by_id(file_id);
  if (result.length === 0) {
    throw new Error(errExep.FILE_NOT_FOUND);
  }
  return {path: "files/" + result[0].file_name, original_name: result[0].original_name, mime_type: result[0].mime_type};
}