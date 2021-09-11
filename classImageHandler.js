const fs = require('fs');
const jimp = require('jimp');
const imageFolder = require('path').dirname(require.main.filename) + `\\images\\`;
const { v4: uuidv4} = require('uuid');

class ImageHandler {
    imagePath = '';
    imageBuffer = '';
    uniqueIdentifier = '';
    constructor(imagePath, uniqueIdentifier = '') {
        this.imagePath = imagePath;
        this.uniqueIdentifier = uniqueIdentifier === '' ? uuidv4() : uniqueIdentifier;
        console.log(imageFolder);
        return this.createImageBuffer();
    }

    async createImageBuffer(){
        this.imageBuffer = await fs.readFileSync(this.imagePath);
        return this;
    }

    async saveImageToFolder(){
        await jimp.read(this.imageBuffer)
            .then((pic, err) => {
                console.log(err, pic);
                pic.resize(400, pic.getHeight())
                    .quality(80)
                    .write(`./images/${this.uniqueIdentifier}.jpeg`);
            });
            // .resize(400)
            // .jpeg({ quality: 80})
            // .toFile(`${imageFolder}${this.uniqueIdentifier}.jpeg`);
    }

    static deleteImage(imageName){
        return new Promise((resolve, reject) => {
            fs.unlink(`${imageFolder}${imageName}`, (err) => {
                if(err){
                    reject(err);
                } else
                    resolve("File deleted.");

            });
        });
    }
}

module.exports = ImageHandler;