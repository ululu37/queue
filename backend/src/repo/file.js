const db = require('./connector')

exports.create = async (queue_id,originalname, filename, mimetype,size) => {
    console.log(queue_id,originalname, filename, mimetype,size);
    
    const result = await db.execute(
        `INSERT INTO file (queue_id,original_name, file_name, mime_type, size)
       VALUES (?, ?, ?, ?, ?);`,
      [queue_id,originalname, filename, mimetype,size])
    return result[0].insertId;
}

exports.listing = async (queue_id) => {
    const [row] = await db.execute('SELECT * FROM file WHERE queue_id = ?;', [queue_id])
    return row
}
exports.delete_by_id = async (file_id) => {
    const result = await db.execute('DELETE FROM file WHERE id = ? ;', [file_id])
}
exports.get_by_id = async (file_id) => {
    const [row] = await db.execute('SELECT * FROM file WHERE id = ? ;', [file_id])
    return row
}